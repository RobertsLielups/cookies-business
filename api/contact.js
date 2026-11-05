import { createHash } from 'node:crypto';
import { Resend } from 'resend';

const MAX_REQUEST_BYTES = 16 * 1024;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_HONEYPOT_LENGTH = 200;
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FIELDS = new Set(['name', 'email', 'message', 'website', 'language', 'turnstileToken']);
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const RATE_LIMITS = {
  ip: { limit: 5, windowMs: 10 * 60 * 1000 },
  recipient: { limit: 3, windowMs: 60 * 60 * 1000 },
  global: { limit: 60, windowMs: 10 * 60 * 1000 },
};

const rateLimitState = globalThis.__cepumbumsContactRateLimitState ?? {
  entries: new Map(),
  operations: 0,
};
globalThis.__cepumbumsContactRateLimitState = rateLimitState;

function sendJson(response, statusCode, payload, headers = {}) {
  response.setHeader('Cache-Control', 'no-store');
  for (const [name, value] of Object.entries(headers)) {
    response.setHeader(name, value);
  }
  return response.status(statusCode).json(payload);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function parseBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return undefined;
    }
  }

  return body;
}

function getBodySize(request) {
  if (typeof request.body === 'string') {
    return Buffer.byteLength(request.body, 'utf8');
  }

  try {
    return Buffer.byteLength(JSON.stringify(request.body), 'utf8');
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

function getClientIp(request) {
  const forwarded = request.headers?.['x-forwarded-for'];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return firstForwarded?.trim() || request.socket?.remoteAddress || 'unknown';
}

function hashRateLimitKey(value) {
  return createHash('sha256').update(value).digest('hex');
}

function pruneRateLimits(state, now) {
  state.operations += 1;
  if (state.operations % 100 !== 0) {
    return;
  }

  for (const [key, entry] of state.entries) {
    if (entry.resetAt <= now) {
      state.entries.delete(key);
    }
  }
}

export function createInMemoryRateLimiter({ state = rateLimitState, now = Date.now } = {}) {
  return {
    consume(scope, identifier) {
      const configuration = RATE_LIMITS[scope];
      const currentTime = now();
      pruneRateLimits(state, currentTime);
      const key = `${scope}:${hashRateLimitKey(identifier)}`;
      let entry = state.entries.get(key);

      if (!entry || entry.resetAt <= currentTime) {
        entry = { count: 0, resetAt: currentTime + configuration.windowMs };
      }

      entry.count += 1;
      state.entries.set(key, entry);

      return {
        allowed: entry.count <= configuration.limit,
        retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000)),
      };
    },
  };
}

function validateContactForm(body) {
  const { name, email, message, website, language, turnstileToken } = body;

  if (typeof name !== 'string' || !name.trim()) {
    return { errorCode: 'nameRequired' };
  }

  if (name.trim().length > MAX_NAME_LENGTH) {
    return { errorCode: 'nameTooLong' };
  }

  if (typeof email !== 'string' || !email.trim() || email.trim().length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email.trim())) {
    return { errorCode: 'emailInvalid' };
  }

  if (typeof message !== 'string' || !message.trim()) {
    return { errorCode: 'messageRequired' };
  }

  if (message.trim().length < MIN_MESSAGE_LENGTH) {
    return { errorCode: 'messageTooShort' };
  }

  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    return { errorCode: 'messageTooLong' };
  }

  if (typeof website !== 'undefined' && (typeof website !== 'string' || website.length > MAX_HONEYPOT_LENGTH)) {
    return { errorCode: 'invalidSubmission' };
  }

  if (typeof language !== 'undefined' && language !== 'lv' && language !== 'en') {
    return { errorCode: 'requestInvalid' };
  }

  if (typeof turnstileToken !== 'string' || !turnstileToken.trim() || turnstileToken.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return { errorCode: 'botVerificationFailed' };
  }

  return {
    value: {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      website: website?.trim() ?? '',
      turnstileToken: turnstileToken.trim(),
    },
  };
}

async function verifyTurnstileToken({ secret, token, remoteIp }) {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp && remoteIp !== 'unknown') {
    body.set('remoteip', remoteIp);
  }

  try {
    const verificationResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(5000),
    });

    if (!verificationResponse.ok) {
      return false;
    }

    const result = await verificationResponse.json();
    return result?.success === true;
  } catch {
    return false;
  }
}

function rateLimited(response, retryAfterSeconds) {
  return sendJson(
    response,
    429,
    { success: false, errorCode: 'rateLimitExceeded' },
    { 'Retry-After': String(retryAfterSeconds) },
  );
}

export function createContactHandler({
  createEmailClient = (apiKey) => new Resend(apiKey),
  verifyBot = verifyTurnstileToken,
  rateLimiter = createInMemoryRateLimiter(),
  environment = process.env,
} = {}) {
  return async function contactHandler(request, response) {
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return sendJson(response, 405, { success: false, errorCode: 'methodNotAllowed' });
    }

    const contentType = request.headers?.['content-type'];
    if (typeof contentType !== 'string' || contentType.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
      return sendJson(response, 415, { success: false, errorCode: 'requestInvalid' });
    }

    const contentLength = Number.parseInt(request.headers?.['content-length'], 10);
    if ((Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) || getBodySize(request) > MAX_REQUEST_BYTES) {
      return sendJson(response, 413, { success: false, errorCode: 'requestInvalid' });
    }

    const body = parseBody(request.body);
    if (!isPlainObject(body)) {
      return sendJson(response, 400, { success: false, errorCode: 'requestInvalid' });
    }

    if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) {
      return sendJson(response, 400, { success: false, errorCode: 'requestInvalid' });
    }

    // Return a neutral success response so simple spam bots cannot detect the honeypot.
    if (typeof body.website === 'string' && body.website.trim()) {
      return sendJson(response, 200, { success: true });
    }

    const validation = validateContactForm(body);
    if (validation.errorCode) {
      return sendJson(response, 400, { success: false, errorCode: validation.errorCode });
    }

    const { name, email, message, turnstileToken } = validation.value;
    const clientIp = getClientIp(request);
    const ipLimit = rateLimiter.consume('ip', clientIp);
    if (!ipLimit.allowed) {
      return rateLimited(response, ipLimit.retryAfterSeconds);
    }

    const { RESEND_API_KEY, CONTACT_EMAIL, CONTACT_FROM_EMAIL, TURNSTILE_SECRET_KEY } = environment;
    if (!RESEND_API_KEY || !CONTACT_EMAIL || !CONTACT_FROM_EMAIL || !TURNSTILE_SECRET_KEY) {
      console.error('Contact service configuration is missing.');
      return sendJson(response, 500, { success: false, errorCode: 'serviceUnavailable' });
    }

    const botVerified = await verifyBot({
      secret: TURNSTILE_SECRET_KEY,
      token: turnstileToken,
      remoteIp: clientIp,
    });
    if (!botVerified) {
      return sendJson(response, 400, { success: false, errorCode: 'botVerificationFailed' });
    }

    const recipientLimit = rateLimiter.consume('recipient', email.toLowerCase());
    if (!recipientLimit.allowed) {
      return rateLimited(response, recipientLimit.retryAfterSeconds);
    }

    const globalLimit = rateLimiter.consume('global', 'all-contact-submissions');
    if (!globalLimit.allowed) {
      return rateLimited(response, globalLimit.retryAfterSeconds);
    }

    const resend = createEmailClient(RESEND_API_KEY);
    const safeName = name.replace(/[\r\n]+/g, ' ');

    try {
      const mainEmail = await resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_EMAIL],
        replyTo: email,
        subject: `New website message from ${safeName}`,
        text: `New message from the Cepumbums website\n\nName:\n${name}\n\nEmail:\n${email}\n\nMessage:\n${message}`,
      });

      if (mainEmail.error || !mainEmail.data) {
        throw new Error('Email provider rejected the message.');
      }
    } catch {
      console.error('Contact email delivery failed.');
      return sendJson(response, 502, { success: false, errorCode: 'serviceUnavailable' });
    }

    // Auto-replies remain disabled until rate limiting is backed by a durable shared store.
    return sendJson(response, 200, { success: true });
  };
}

export default createContactHandler();
