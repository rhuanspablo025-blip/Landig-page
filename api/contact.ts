import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const sql = neon(process.env.POSTGRES_URL!);

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido.' });
  }

  const { name, email, phone, message } = request.body ?? {};
  if (![name, email, phone, message].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    await sql`
      INSERT INTO contact_messages (name, email, phone, message)
      VALUES (${name.trim()}, ${email.trim()}, ${phone.trim()}, ${message.trim()})
    `;
    return response.status(201).json({ ok: true });
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    return response.status(500).json({ error: 'Não foi possível salvar sua mensagem.' });
  }
}
