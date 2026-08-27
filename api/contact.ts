import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const sql = neon(process.env.POSTGRES_URL!);
const recipient = 'rhuaspablo025@gmail.com';
const attempts = new Map<string, { count: number; expiresAt: number }>();
const maxAttempts = 5;
const windowMs = 10 * 60 * 1000;

function getClientIp(request: VercelRequest) {
  return request.headers['x-real-ip']?.toString() ?? request.headers['x-forwarded-for']?.toString().split(',')[0].trim() ?? 'unknown';
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido.' });
  }

  const origin = request.headers.origin;
  const host = request.headers.host;
  if (origin && host && new URL(origin).host !== host) {
    return response.status(403).json({ error: 'Origem não autorizada.' });
  }

  const now = Date.now();
  const clientIp = getClientIp(request);
  const attempt = attempts.get(clientIp);
  if (attempt && attempt.expiresAt > now && attempt.count >= maxAttempts) {
    response.setHeader('Retry-After', Math.ceil((attempt.expiresAt - now) / 1000));
    return response.status(429).json({ error: 'Muitas tentativas. Tente novamente mais tarde.' });
  }
  attempts.set(clientIp, { count: attempt && attempt.expiresAt > now ? attempt.count + 1 : 1, expiresAt: now + windowMs });

  const body = request.body ?? {};
  const { name, email, phone, message, website } = body;
  if (website || ![name, email, phone, message].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ error: 'Preencha todos os campos.' });
  }
  if (name.length > 120 || email.length > 254 || phone.length > 30 || message.length > 5000) {
    return response.status(413).json({ error: 'Algum campo ultrapassou o limite permitido.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return response.status(400).json({ error: 'E-mail inválido.' });
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      return response.status(503).json({ error: 'Envio de e-mail ainda não configurado.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: recipient,
      replyTo: email.trim(),
      subject: `Novo contato do portfolio: ${name.trim()}`,
      text: `Nome: ${name.trim()}\nE-mail: ${email.trim()}\nTelefone: ${phone.trim()}\n\nMensagem:\n${message.trim()}`,
    });

    if (emailResult.error) {
      console.error('Erro ao enviar e-mail:', emailResult.error);
      return response.status(502).json({ error: 'Não foi possível enviar sua mensagem.' });
    }

    if (process.env.POSTGRES_URL) {
      await sql`
        INSERT INTO contact_messages (name, email, phone, message)
        VALUES (${name.trim()}, ${email.trim()}, ${phone.trim()}, ${message.trim()})
      `;
    }

    return response.status(201).json({ ok: true });
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    return response.status(500).json({ error: 'Não foi possível salvar sua mensagem.' });
  }
}
