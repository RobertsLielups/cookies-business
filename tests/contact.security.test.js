import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler, createInMemoryRateLimiter } from '../api/contact.js';

const environment = {
  RESEND_API_KEY: 'test-api-key',
  CONTACT_EMAIL: 'inbox@example.test',
  CONTACT_FROM_EMAIL: 'Website <sender@example.test>',
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
};

function validBody(overrides = {}) {
  return {
    name: 'Test User',
    email: 'visitor@example.test',
    message: 'A sufficiently long test message.',
    website: '',
    language: 'en',
    turnstileToken: 'valid-test-token',
    ...overrides,
  };
}

function createRequest({
  method = 'POST',
  body = validBody(),
  contentType = 'application/json',
  ip = '192.0.2.1',
  headers = {},
} = {}) {
  return {
    method,
    body,
    headers: {
      ...(contentType === null ? {} : { 'content-type': contentType }),
      'x-forwarded-for': ip,
      ...headers,
    },
    socket: { remoteAddress: ip },
  };
}

function createResponse() {
  return {
    statusCode: null,
    payload: null,
    headers: {},
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

function createHarness({ verifyBot = async () => true, send, testEnvironment = environment } = {}) {
  const sentEmails = [];
  const emailSend = send ?? (async (message) => {
    sentEmails.push(message);
    return { data: { id: 'test-message-id' }, error: null };
  });
  const state = { entries: new Map(), operations: 0 };
  const handler = createContactHandler({
    environment: testEnvironment,
    verifyBot,
    rateLimiter: createInMemoryRateLimiter({ state }),
    createEmailClient: () => ({ emails: { send: emailSend } }),
  });

  return { handler, sentEmails };
}

async function invoke(handler, requestOptions) {
  const response = createResponse();
  await handler(createRequest(requestOptions), response);
  return response;
}

test('rejects non-POST methods with 405', async () => {
  const { handler } = createHarness();
  const response = await invoke(handler, { method: 'GET' });

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.allow, 'POST');
  assert.deepEqual(response.payload, { success: false, errorCode: 'methodNotAllowed' });
});

test('rejects malformed JSON bodies', async () => {
  const { handler } = createHarness();
  const response = await invoke(handler, { body: '{not-json' });

  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.errorCode, 'requestInvalid');
});

test('rejects null, arrays, and primitive bodies', async (t) => {
  for (const body of [null, [], 42, true]) {
    await t.test(String(body), async () => {
      const { handler } = createHarness();
      const response = await invoke(handler, { body });
      assert.equal(response.statusCode, 400);
      assert.equal(response.payload.errorCode, 'requestInvalid');
    });
  }
});

test('rejects unexpected fields', async () => {
  const { handler } = createHarness();
  const response = await invoke(handler, { body: validBody({ admin: true }) });

  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.errorCode, 'requestInvalid');
});

test('requires application/json content type', async (t) => {
  for (const contentType of [null, 'text/plain', 'application/x-www-form-urlencoded']) {
    await t.test(String(contentType), async () => {
      const { handler } = createHarness();
      const response = await invoke(handler, { contentType });
      assert.equal(response.statusCode, 415);
      assert.equal(response.payload.errorCode, 'requestInvalid');
    });
  }
});

test('rejects requests larger than the application limit', async () => {
  const { handler } = createHarness();
  const response = await invoke(handler, {
    body: validBody(),
    headers: { 'content-length': String(16 * 1024 + 1) },
  });

  assert.equal(response.statusCode, 413);
  assert.equal(response.payload.errorCode, 'requestInvalid');
});

test('honeypot returns neutral success without verification or email', async () => {
  let verificationCalls = 0;
  const { handler, sentEmails } = createHarness({
    verifyBot: async () => {
      verificationCalls += 1;
      return true;
    },
  });
  const response = await invoke(handler, {
    body: { ...validBody(), website: 'filled-by-bot', turnstileToken: '' },
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, { success: true });
  assert.equal(verificationCalls, 0);
  assert.equal(sentEmails.length, 0);
});

test('enforces field boundaries', async (t) => {
  await t.test('accepts the maximum name length', async () => {
    const { handler } = createHarness();
    const response = await invoke(handler, { body: validBody({ name: 'a'.repeat(100) }) });
    assert.equal(response.statusCode, 200);
  });

  await t.test('rejects a name over the maximum', async () => {
    const { handler } = createHarness();
    const response = await invoke(handler, { body: validBody({ name: 'a'.repeat(101) }) });
    assert.equal(response.statusCode, 400);
    assert.equal(response.payload.errorCode, 'nameTooLong');
  });

  await t.test('accepts the minimum message length', async () => {
    const { handler } = createHarness();
    const response = await invoke(handler, { body: validBody({ message: 'a'.repeat(10) }) });
    assert.equal(response.statusCode, 200);
  });

  await t.test('rejects a message over the maximum', async () => {
    const { handler } = createHarness();
    const response = await invoke(handler, { body: validBody({ message: 'a'.repeat(5001) }) });
    assert.equal(response.statusCode, 400);
    assert.equal(response.payload.errorCode, 'messageTooLong');
  });
});

test('rejects missing and invalid bot challenges', async (t) => {
  await t.test('missing token', async () => {
    const { handler } = createHarness();
    const body = validBody();
    delete body.turnstileToken;
    const response = await invoke(handler, { body });
    assert.equal(response.statusCode, 400);
    assert.equal(response.payload.errorCode, 'botVerificationFailed');
  });

  await t.test('invalid token', async () => {
    const { handler } = createHarness({ verifyBot: async () => false });
    const response = await invoke(handler);
    assert.equal(response.statusCode, 400);
    assert.equal(response.payload.errorCode, 'botVerificationFailed');
  });
});

test('fails safely when server-only configuration is missing', async () => {
  const { TURNSTILE_SECRET_KEY, ...incompleteEnvironment } = environment;
  assert.ok(TURNSTILE_SECRET_KEY);
  const { handler, sentEmails } = createHarness({ testEnvironment: incompleteEnvironment });
  const response = await invoke(handler);

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.payload, { success: false, errorCode: 'serviceUnavailable' });
  assert.equal(sentEmails.length, 0);
});

test('rate limits by IP and includes Retry-After', async () => {
  const { handler } = createHarness();
  let response;

  for (let index = 0; index < 6; index += 1) {
    response = await invoke(handler, {
      body: validBody({ email: `visitor-${index}@example.test` }),
      ip: '192.0.2.10',
    });
  }

  assert.equal(response.statusCode, 429);
  assert.equal(response.payload.errorCode, 'rateLimitExceeded');
  assert.match(response.headers['retry-after'], /^\d+$/);
});

test('rate limits repeated recipient addresses', async () => {
  const { handler } = createHarness();
  let response;

  for (let index = 0; index < 4; index += 1) {
    response = await invoke(handler, { ip: `192.0.2.${20 + index}` });
  }

  assert.equal(response.statusCode, 429);
  assert.equal(response.payload.errorCode, 'rateLimitExceeded');
});

test('applies a global submission ceiling', async () => {
  const { handler } = createHarness();
  let response;

  for (let index = 0; index < 61; index += 1) {
    response = await invoke(handler, {
      body: validBody({ email: `global-${index}@example.test` }),
      ip: `198.51.100.${index}`,
    });
  }

  assert.equal(response.statusCode, 429);
  assert.equal(response.payload.errorCode, 'rateLimitExceeded');
});

test('returns a generic error when the email provider fails', async () => {
  const { handler } = createHarness({
    send: async () => {
      throw new Error('provider details must not escape');
    },
  });
  const response = await invoke(handler);

  assert.equal(response.statusCode, 502);
  assert.deepEqual(response.payload, { success: false, errorCode: 'serviceUnavailable' });
  assert.equal(JSON.stringify(response.payload).includes('provider details'), false);
});

test('strips CR/LF from email subject and does not auto-reply', async () => {
  const { handler, sentEmails } = createHarness();
  const response = await invoke(handler, {
    body: validBody({ name: 'Header\r\nInjected: value' }),
  });

  assert.equal(response.statusCode, 200);
  assert.equal(sentEmails.length, 1);
  assert.equal(sentEmails[0].to[0], environment.CONTACT_EMAIL);
  assert.equal(sentEmails[0].subject.includes('\r'), false);
  assert.equal(sentEmails[0].subject.includes('\n'), false);
  assert.equal('html' in sentEmails[0], false);
});
