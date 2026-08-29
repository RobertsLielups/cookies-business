import { Resend } from 'resend';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendJson(response, statusCode, payload) {
  response.status(statusCode).json(payload);
}

function parseBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  return body && typeof body === 'object' ? body : null;
}

function validateContactForm(body) {
  const { name, email, message, website } = body;

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Please enter your name.' };
  }

  if (name.trim().length > MAX_NAME_LENGTH) {
    return { error: 'Your name is too long.' };
  }

  if (typeof email !== 'string' || !email.trim() || email.trim().length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email.trim())) {
    return { error: 'Please enter a valid email address.' };
  }

  if (typeof message !== 'string' || !message.trim()) {
    return { error: 'Please enter a message.' };
  }

  if (message.trim().length < MIN_MESSAGE_LENGTH) {
    return { error: 'Your message is too short.' };
  }

  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    return { error: 'Your message is too long.' };
  }

  if (typeof website !== 'undefined' && typeof website !== 'string') {
    return { error: 'Invalid form submission.' };
  }

  return {
    value: {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      website: website?.trim() ?? '',
    },
  };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { success: false, error: 'Method not allowed.' });
  }

  const body = parseBody(request.body);
  if (!body) {
    return sendJson(response, 400, { success: false, error: 'Invalid request body.' });
  }

  const validation = validateContactForm(body);
  if (validation.error) {
    return sendJson(response, 400, { success: false, error: validation.error });
  }

  const { name, email, message, website } = validation.value;

  // Return a neutral success response so spam bots cannot detect the honeypot.
  if (website) {
    return sendJson(response, 200, { success: true });
  }

  const { RESEND_API_KEY, CONTACT_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact email configuration is missing.');
    return sendJson(response, 500, { success: false, error: 'Unable to send your message right now. Please try again later.' });
  }

  const resend = new Resend(RESEND_API_KEY);
  const safeName = name.replace(/[\r\n]+/g, ' ');
  let mainEmail;

  try {
    mainEmail = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `New website message from ${safeName}`,
      text: `New message from the Cepumbums website\n\nName:\n${name}\n\nEmail:\n${email}\n\nMessage:\n${message}`,
    });
  } catch {
    console.error('Contact email delivery failed.');
    return sendJson(response, 502, { success: false, error: 'Unable to send your message right now. Please try again later.' });
  }

  if (mainEmail.error || !mainEmail.data) {
    console.error('Contact email delivery failed.');
    return sendJson(response, 502, { success: false, error: 'Unable to send your message right now. Please try again later.' });
  }

  try {
    const autoReply = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [email],
      subject: 'We received your message — Cepumbums',
      text: `Hello ${name},\n\nThank you for contacting Cepumbums.\n\nWe have received your message and will get back to you as soon as possible.\n\nCepumbums`,
    });

    // The main message was delivered successfully. Do not make the customer retry
    // (and create a duplicate inquiry) if only the confirmation email fails.
    if (autoReply.error || !autoReply.data) {
      console.error('Contact auto-reply failed.');
    }
  } catch {
    console.error('Contact auto-reply failed.');
  }

  return sendJson(response, 200, { success: true });
}
