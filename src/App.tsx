import { useEffect, useState } from 'react';
import { ArrowUpRight, AtSign, BriefcaseBusiness, Check, ChevronDown, Code2, Menu, MessageCircle, Moon, Sun, X } from 'lucide-react';
import content from './data/portfolio.json';

type Project = (typeof content.projects)[number];

const faqs = [
  ['Você atende projetos pequenos?', 'Sim. Landing pages, automações pontuais e MVPs fazem parte do meu trabalho. O escopo é definido em uma conversa inicial.'],
  ['Como funciona o primeiro contato?', 'Você me conta o problema, eu faço as perguntas certas e devolvo uma proposta objetiva com escopo, prazo e próximos passos.'],
  ['Você trabalha remoto?', 'Sim. Atendo de forma remota e assíncrona, com comunicação clara e entregas frequentes para manter tudo visível.'],
];

type LegalDocument = 'privacy' | 'terms' | null;

const legalContent = {
  privacy: {
    label: 'Privacidade e dados',
    title: 'Aviso de privacidade',
    paragraphs: [
      'Este site coleta apenas os dados que você decide enviar pelo formulário de contato: nome, e-mail, telefone e mensagem. Eles são usados exclusivamente para responder à sua solicitação e conversar sobre um possível projeto.',
      'O formulário abre uma conversa no WhatsApp. Ao continuar, você também estará sujeito às políticas do WhatsApp. Não vendemos, alugamos ou compartilhamos seus dados para publicidade.',
      'Você pode pedir confirmação de tratamento, acesso, correção, exclusão ou informações sobre o uso dos seus dados. Para exercer seus direitos, envie um e-mail para rhuanspablo025@gmail.com.',
      'Este aviso pode ser atualizado quando as práticas do site mudarem. Última atualização: agosto de 2026.',
    ],
  },
  terms: {
    label: 'Diretrizes e direitos',
    title: 'Uso responsável da comunidade',
    paragraphs: [
      'Este espaço existe para apresentar trabalho, trocar ideias e iniciar conversas profissionais com respeito. Não são permitidos assédio, discriminação, ameaças, spam, tentativa de fraude ou uso de conteúdo de terceiros sem autorização.',
      'Você mantém os direitos sobre as informações e materiais que enviar. Ao compartilhar uma mensagem, declara que tem autorização para fazê-lo e permite seu uso apenas para responder ao contato e avaliar a demanda apresentada.',
      'Os projetos, textos, marca e identidade visual deste portfólio não devem ser copiados, redistribuídos ou usados para se passar por outra pessoa sem autorização. Links externos seguem as regras de seus próprios serviços.',
      'Dúvidas, pedidos de acessibilidade ou denúncias podem ser enviados para rhuanspablo025@gmail.com. O contato será tratado com respeito e confidencialidade dentro dos limites da lei.',
    ],
  },
};

function App() {
  const [siteContent, setSiteContent] = useState(content);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sent, setSent] = useState(false);
  const [cookieChoice, setCookieChoice] = useState<'accepted' | 'rejected' | null>(() => {
    const savedChoice = localStorage.getItem('rp-cookie-choice');
    return savedChoice === 'accepted' || savedChoice === 'rejected' ? savedChoice : null;
  });
  const [legalDocument, setLegalDocument] = useState<LegalDocument>(null);

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => {
    document.querySelectorAll<HTMLInputElement>('input[type="email"]').forEach((input) => input.removeAttribute('pattern'));
  }, []);
  useEffect(() => {
    const formatPhone = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.type !== 'tel') return;
      const digits = input.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length <= 2) {
        input.value = digits ? `(${digits}` : '';
      } else if (digits.length <= 10) {
        input.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      } else {
        input.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }
    };
    document.addEventListener('input', formatPhone);
    return () => document.removeEventListener('input', formatPhone);
  }, []);
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>('.contact-form');
    if (!form) return;
    const saveContact = (event: SubmitEvent) => {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
        }),
      }).catch(() => undefined);
    };
    form.addEventListener('submit', saveContact);
    return () => form.removeEventListener('submit', saveContact);
  }, []);
  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((databaseContent) => setSiteContent(databaseContent as typeof content))
      .catch(() => undefined);
  }, []);
  const projects = siteContent.projects.filter((project) => filter === 'Todos' || project.category === filter);
  const categories = ['Todos', ...new Set(siteContent.projects.map((project) => project.category))];
  const saveCookieChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem('rp-cookie-choice', choice);
    setCookieChoice(choice);
  };

  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#inicio" onClick={() => setMenuOpen(false)}><span>RP</span> / studio</a>
      <button className="menu-toggle" aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>{siteContent.nav.map((item) => <a key={item} href={item === 'Sobre mim' ? '#sobre-mim' : `#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}<a className="nav-cta" href="#contato" onClick={() => setMenuOpen(false)}>Vamos conversar <ArrowUpRight size={15} /></a></nav>
      <button className="theme-button" aria-label="Alternar tema" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy"><p className="eyebrow">DESENVOLVEDOR FULL STACK <span>●</span> PORTEIRINHA, MG</p><h1>Software com<br /><em>pulso humano.</em></h1><p className="hero-lede">Eu construo automações, APIs e interfaces que tiram ideias do papel e colocam operações para funcionar melhor.</p><div className="hero-actions"><a className="button button-dark" href="#projetos">Explorar projetos <ArrowUpRight size={17} /></a><a className="button button-outline" href="/Curriculo-Rhuan-Pablo.pdf" download>Baixar currículo <ArrowUpRight size={17} /></a><a className="text-link" href="mailto:rhuanspablo025@gmail.com">rhuanspablo025@gmail.com</a></div><div className="business-badge"><span>ATENDIMENTO PROFISSIONAL</span><strong>{siteContent.business.registration}</strong><small>{siteContent.business.name} · CNPJ {siteContent.business.cnpj}</small></div></div>
        <div className="hero-art"><div className="art-label">01 / 04</div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="code-card"><div className="code-top"><span>rhuan@studio</span><span>online</span></div><pre><code><i>const</i> <b>solution</b> = {'{'}<br />  <span>clarity</span>: <strong>true</strong>,<br />  <span>impact</span>: <strong>high</strong>,<br />  <span>status</span>: <strong>"shipping"</strong><br />{'}'}</code></pre><div className="code-footer"><span>BUILDING WITH INTENTION</span><span>↗</span></div></div></div>
      </section>

      <section className="ticker" aria-label="Especialidades"><span>PYTHON</span><b>✳</b><span>FASTAPI</span><b>✳</b><span>REACT</span><b>✳</b><span>AUTOMAÇÃO</span><b>✳</b><span>PRODUTO DIGITAL</span><b>✳</b><span>PYTHON</span><b>✳</b><span>FASTAPI</span></section>

      <section className="section about-me-section" id="sobre-mim"><div className="about-me-image"><img src="/images/rhuan-pablo.jpeg" alt="Rhuan Pablo" /></div><div className="about-me-copy"><div className="section-kicker">/ SOBRE MIM</div><h2>Construindo meu caminho<br /><span>com curiosidade.</span></h2><p>Meu nome é Rhuan Pablo e sou graduando em Sistemas de Informação (BSI) pelo IFNMG, Instituto Federal do Norte de Minas Gerais, Campus Porteirinha.</p><p>Tenho 19 anos e construí minha trajetória na tecnologia com dedicação, curiosidade e vontade de resolver problemas. Foi na tecnologia que encontrei uma forma de transformar ideias em soluções reais.</p><p>Durante quase três anos, trabalhei como analista de sistemas na Dlink Sistemas, atuando no atendimento ao público no segmento de GLP. Nesse período, trabalhei diretamente na resolução de problemas do sistema, orientação de usuários e suporte às necessidades da operação.</p><p>Também participo da IFTCH Jr., empresa júnior da faculdade, onde venho ampliando minha experiência em projetos reais e desenvolvimento de soluções digitais. Essas experiências me ensinaram a unir responsabilidade, colaboração e atenção aos detalhes para entregar algo que realmente tenha utilidade.</p><div className="about-me-signature">Rhuan Pablo <span>·</span> analista de sistemas e desenvolvedor</div></div></section>

      <section className="section intro-section" id="sobre"><div className="section-kicker">/ SOBRE O TRABALHO</div><div className="split-heading"><h2>Menos ruído.<br /><span>Mais resultado.</span></h2><div><p>Sou Rhuan, graduando em Sistemas de Informação (BSI) pelo IFNMG, Instituto Federal do Norte de Minas Gerais, Campus Porteirinha, e desenvolvedor com foco em Python. Gosto de entrar no problema antes de escolher a tecnologia.</p><p>O resultado precisa ser bonito, mas principalmente confiável: fácil de entender, simples de manter e pronto para crescer.</p><a className="text-link dark-link" href="#contato">Conheça meu jeito de trabalhar <ArrowUpRight size={15} /></a></div></div><div className="metric-row"><div><strong>03<span>+</span></strong><small>PROJETOS ENTREGUES</small></div><div><strong>02<span>+</span></strong><small>ANOS ESCREVENDO CÓDIGO</small></div><div><strong>100<span>%</span></strong><small>FOCO NO PROBLEMA REAL</small></div></div></section>

      <section className="section timeline-section"><div className="section-kicker">/ TRAJETÓRIA</div><div className="timeline-heading"><h2>Experiência que<br /><span>vira repertório.</span></h2><p>Cada etapa trouxe um problema diferente para resolver e uma nova forma de enxergar tecnologia, pessoas e produto.</p></div><div className="timeline"><article><span>QUASE 3 ANOS</span><h3>Dlink Sistemas</h3><p>Analista de sistemas com atendimento ao público no segmento de GLP, resolução de problemas no sistema e orientação de usuários.</p></article><article><span>EM ANDAMENTO</span><h3>IFNMG · Campus Porteirinha</h3><p>Graduação em Sistemas de Informação (BSI), conectando fundamentos acadêmicos com projetos práticos.</p></article><article><span>PROJETOS REAIS</span><h3>IFTCH Jr.</h3><p>Participação em projetos digitais para a comunidade, incluindo o site da Festa do Queijo e uma landing page de sorteio.</p></article></div></section>

      <section className="section skills-section"><div className="section-kicker">/ HABILIDADES</div><div className="skills-layout"><h2>O que levo<br /><span>para cada projeto.</span></h2><div className="skills-columns"><div><small>TÉCNICAS</small><p>Python · React · TypeScript · FastAPI · APIs REST · PostgreSQL · SQLite · Git</p></div><div><small>PROFISSIONAIS</small><p>Atendimento ao público · Resolução de problemas · Comunicação clara · Trabalho em equipe · Organização</p></div></div></div></section>

      <section className="section services-section" id="serviços"><div className="section-kicker">/ COMO POSSO AJUDAR</div><div className="section-heading"><h2>Trabalho que<br /><span>move a operação.</span></h2><p>Da primeira linha de código ao produto no ar, cada entrega nasce de um problema bem compreendido.</p></div><div className="service-grid">{siteContent.services.map((service) => <article className="service" key={service.number}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><div className="tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div></section>

      <section className="section projects-section" id="projetos"><div className="section-kicker">/ SELEÇÃO DE PROJETOS</div><div className="section-heading"><h2>Ideias que ganharam<br /><span>forma e função.</span></h2><div className="filters">{categories.map((category) => <button className={filter === category ? 'active' : ''} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div></div><div className="projects-grid">{projects.map((project: Project, index) => <article className={project.featured ? 'project featured' : 'project'} key={project.title}><div className="project-visual"><span>0{index + 1}</span><div className="visual-lines"><i /><i /><i /></div></div><div className="project-info"><small>{project.category}</small><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div><a href={'url' in project ? project.url : '#contato'} className="project-link" target={'url' in project ? '_blank' : undefined} rel={'url' in project ? 'noreferrer' : undefined}>{'url' in project ? 'Visitar site' : 'Ver detalhes'} <ArrowUpRight size={16} /></a></div></article>)}</div></section>

      <section className="section stack-section" id="stack"><div className="section-kicker">/ FERRAMENTAS</div><div className="stack-layout"><h2>Uma stack<br /><span>sem ego.</span></h2><p>Escolho a ferramenta que deixa a solução mais simples. Hoje, meu terreno principal é o ecossistema Python, com React no front e curiosidade suficiente para continuar aprendendo.</p><div className="stack-list">{siteContent.stack.map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}</div></div></section>

      <section className="section contact-section" id="contato"><div className="contact-copy"><div className="section-kicker">/ O PRÓXIMO PASSO</div><h2>Tem um problema<br /><em>interessante?</em></h2><p>Me conte onde está o atrito. A primeira conversa é por minha conta.</p><div className="contact-links"><a href="mailto:rhuanspablo025@gmail.com">rhuanspablo025@gmail.com <ArrowUpRight size={17} /></a><a href={content.socials.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={16} /> LinkedIn <ArrowUpRight size={17} /></a><a href={content.socials.github} target="_blank" rel="noreferrer"><Code2 size={16} /> GitHub <ArrowUpRight size={17} /></a><a href={content.socials.instagram} target="_blank" rel="noreferrer"><AtSign size={16} /> Instagram <ArrowUpRight size={17} /></a></div><div className="mei-card"><span>PRESTAÇÃO DE SERVIÇOS</span><strong>{content.business.registration} · {content.business.name}</strong><small>CNPJ {content.business.cnpj}</small></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); const message = encodeURIComponent(`Olá! Meu nome é ${formData.get('name')}.\nE-mail: ${formData.get('email')}\nTelefone: ${formData.get('phone')}\n\n${formData.get('message')}`); window.open(`https://wa.me/5538999939219?text=${message}`, '_blank', 'noopener,noreferrer'); setSent(true); }}><label>Seu nome<input name="name" required placeholder="Como posso te chamar?" /></label><label>Seu e-mail<input name="email" required type="email" title="Digite um e-mail válido." placeholder="voce@empresa.com" /></label><label>Seu telefone<input name="phone" required type="tel" inputMode="tel" pattern="\\+?[0-9\\s()\\-]{10,}" title="Digite um telefone válido com DDD." placeholder="(38) 99999-9999" /></label><label>O que você tem em mente?<textarea name="message" required placeholder="Um novo produto, uma automação, uma ideia..." rows={4} /></label><button className="button button-dark" type="submit">{sent ? <>Mensagem preparada <Check size={17} /></> : <>Enviar mensagem <ArrowUpRight size={17} /></>}</button></form></section>
        <section className="section contact-section" id="contato"><div className="contact-copy"><div className="section-kicker">/ O PRÓXIMO PASSO</div><h2>Tem um problema<br /><em>interessante?</em></h2><p>Me conte onde está o atrito. A primeira conversa é por minha conta.</p><div className="contact-links"><a href="mailto:rhuanspablo025@gmail.com">rhuanspablo025@gmail.com <ArrowUpRight size={17} /></a><a href={siteContent.socials.linkedin} target="_blank" rel="noreferrer"><BriefcaseBusiness size={16} /> LinkedIn <ArrowUpRight size={17} /></a><a href={siteContent.socials.github} target="_blank" rel="noreferrer"><Code2 size={16} /> GitHub <ArrowUpRight size={17} /></a><a href={siteContent.socials.instagram} target="_blank" rel="noreferrer"><AtSign size={16} /> Instagram <ArrowUpRight size={17} /></a></div><div className="mei-card"><span>PRESTAÇÃO DE SERVIÇOS</span><strong>{siteContent.business.registration} · {siteContent.business.name}</strong><small>CNPJ {siteContent.business.cnpj}</small></div></div><form className="contact-form" onSubmit={async (event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); const contact = { name: formData.get('name'), email: formData.get('email'), phone: formData.get('phone'), message: formData.get('message') }; try { await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact) }); } catch {} const message = encodeURIComponent(`Olá! Meu nome é ${contact.name}.\nE-mail: ${contact.email}\nTelefone: ${contact.phone}\n\n${contact.message}`); window.open(`https://wa.me/5538999939219?text=${message}`, '_blank', 'noopener,noreferrer'); setSent(true); }}><label>Seu nome<input name="name" required placeholder="Como posso te chamar?" /></label><label>Seu e-mail<input name="email" required type="email" pattern="[^\\s@]+@[^\\s@]+\\.[^\\s@]+" title="Digite um e-mail válido." placeholder="voce@empresa.com" /></label><label>Seu telefone<input name="phone" required type="tel" inputMode="tel" pattern="\\+?[0-9\\s()\\-]{10,}" title="Digite um telefone válido com DDD." placeholder="(38) 99999-9999" /></label><label>O que você tem em mente?<textarea name="message" required placeholder="Um novo produto, uma automação, uma ideia..." rows={4} /></label><button className="button button-dark" type="submit">{sent ? <>Mensagem preparada <Check size={17} /></> : <>Enviar mensagem <ArrowUpRight size={17} /></>}</button></form></section>

      <section className="faq-section" id="faq"><div className="section-kicker">/ PERGUNTAS FREQUENTES</div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={openFaq === index ? 'faq open' : 'faq'} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><ChevronDown size={18} /></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>
    </main>
    <footer><span>© 2026 Rhuan Pablo</span><span>Feito com curiosidade e código.</span><div className="footer-links"><button onClick={() => setLegalDocument('privacy')}>Privacidade</button><button onClick={() => setLegalDocument('terms')}>Diretrizes</button><a href="#inicio">Voltar ao topo ↑</a></div></footer>
    {cookieChoice === null && <aside className="cookie-banner" aria-label="Preferências de cookies"><div><strong>Privacidade primeiro.</strong><p>Usamos apenas armazenamento essencial para lembrar suas preferências. Não usamos cookies de publicidade ou rastreamento.</p><button className="cookie-policy" onClick={() => setLegalDocument('privacy')}>Ler aviso de privacidade</button></div><div className="cookie-actions"><button className="cookie-reject" onClick={() => saveCookieChoice('rejected')}>Recusar</button><button className="cookie-accept" onClick={() => saveCookieChoice('accepted')}>Aceitar essenciais</button></div></aside>}
    {legalDocument && <div className="legal-backdrop" role="presentation" onClick={() => setLegalDocument(null)}><section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={(event) => event.stopPropagation()}><button className="legal-close" aria-label="Fechar documento" onClick={() => setLegalDocument(null)}><X size={20} /></button><span className="section-kicker">/ {legalContent[legalDocument].label.toUpperCase()}</span><h2 id="legal-title">{legalContent[legalDocument].title}</h2>{legalContent[legalDocument].paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section></div>}
    <a className="whatsapp-float" href="https://wa.me/5538999939219?text=Ol%C3%A1%21%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto." target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp"><MessageCircle size={25} /></a>
  </div>;
}

export default App;
