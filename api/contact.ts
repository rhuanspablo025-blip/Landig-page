import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const sql = neon(process.env.POSTGRES_URL!);
const recipient = 'rhuaspablo025@gmail.com';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido.' });
  }

  const { name, email, phone, message } = request.body ?? {};
  if (![name, email, phone, message].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ error: 'Preencha todos os campos.' });
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
