CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  number TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stack (
  name TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO site_settings (key, value) VALUES
  ('nav', '["Sobre", "Sobre mim", "Serviços", "Projetos", "Stack", "Contato"]'),
  ('socials', '{"linkedin":"https://www.linkedin.com/in/rhuanspablodev","github":"https://github.com/rhuanspablo025-blip","instagram":"https://www.instagram.com/rhuan_santosz/"}'),
  ('business', '{"name":"Rhuan Pablo Santos de Sá","registration":"MEI","cnpj":"68.776.600/0001-80"}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO services (number, title, text, tags) VALUES
  ('01', 'Automação de processos', 'Fluxos repetitivos viram sistemas confiáveis: scripts, integrações e relatórios que trabalham enquanto você foca no negócio.', '["Python", "APIs", "Scripts"]'),
  ('02', 'Backend que aguenta', 'APIs REST bem estruturadas, banco de dados modelado e documentação para tirar a operação do improviso.', '["FastAPI", "PostgreSQL", "REST"]'),
  ('03', 'Interfaces com intenção', 'Produtos digitais responsivos, rápidos e claros para transformar uma boa solução técnica em uma experiência que dá vontade de usar.', '["React", "TypeScript", "CSS"]')
ON CONFLICT (number) DO NOTHING;

INSERT INTO projects (title, category, description, stack, url, featured, sort_order) VALUES
  ('Site do queijo', 'Site institucional', 'Site de divulgação dos produtores de queijo de Porteirinha, desenvolvido para a última Festa do Queijo em parceria com a IFTCH Jr.', '["React", "TypeScript", "CSS"]', 'https://share.google/G4n1N34YJxOvRvEq3', TRUE, 1),
  ('Landing page do sorteio', 'Landing page', 'Coordenação e desenvolvimento de uma landing page para a ganhadora de um sorteio realizado pela IFTCH Jr., empresa júnior da faculdade.', '["React", "TypeScript", "CSS"]', NULL, FALSE, 2),
  ('Ficha de treino Gilmarcio', 'Aplicação web', 'Projeto web para organização e apresentação de uma ficha de treino personalizada.', '["React", "TypeScript", "CSS"]', NULL, FALSE, 3)
ON CONFLICT DO NOTHING;

INSERT INTO stack (name, sort_order) VALUES
  ('Python', 1), ('FastAPI', 2), ('TypeScript', 3), ('React', 4), ('PostgreSQL', 5), ('SQLite', 6), ('Pandas', 7), ('Git', 8), ('Analista de sistemas', 9)
ON CONFLICT (name) DO NOTHING;
