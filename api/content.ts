import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const sql = neon(process.env.POSTGRES_URL!);

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Método não permitido.' });
  }

  response.setHeader('Cache-Control', 'no-store');

  try {
    const [settings, services, projects, stack] = await Promise.all([
      sql`SELECT key, value FROM site_settings ORDER BY key`,
      sql`SELECT number, title, text, tags FROM services ORDER BY number`,
      sql`SELECT title, category, description, stack, url, featured FROM projects ORDER BY sort_order, title`,
      sql`SELECT name FROM stack ORDER BY sort_order, name`,
    ]);

    const settingMap = Object.fromEntries(settings.map((item) => [item.key, item.value]));
    return response.status(200).json({
      nav: JSON.parse(settingMap.nav ?? '[]'),
      socials: JSON.parse(settingMap.socials ?? '{}'),
      business: JSON.parse(settingMap.business ?? '{}'),
      services,
      projects: projects.map((project) => ({ ...project, featured: Boolean(project.featured) })),
      stack: stack.map((item) => item.name),
    });
  } catch (error) {
    console.error('Erro ao carregar conteúdo:', error);
    return response.status(500).json({ error: 'Não foi possível carregar o conteúdo.' });
  }
}
