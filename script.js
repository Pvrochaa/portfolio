// Ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar muda ao rolar
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  })
);

// Reveal ao entrar na viewport
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io.observe(el);
});

// Efeito de digitação no hero
const typedEl = document.getElementById('typed');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typedEl && !reduceMotion) {
  const words = ['Full-Stack', 'Front-end', 'Back-end'];
  let wi = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = words[wi];
    ci += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, ci);
    let delay = deleting ? 55 : 110;
    if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
    setTimeout(tick, delay);
  };
  tick();
} else if (typedEl) {
  typedEl.textContent = 'Full-Stack';
}

// Barra de progresso de rolagem
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
const onScrollExtras = () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  if (progress) progress.style.width = `${Math.min(scrolled * 100, 100)}%`;
  if (toTop) toTop.classList.toggle('show', h.scrollTop > 400);
};
onScrollExtras();
window.addEventListener('scroll', onScrollExtras, { passive: true });
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Envio do formulário de contato (Web3Forms)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const key = form.querySelector('input[name="access_key"]').value;
    if (key.includes('COLE_SUA')) {
      status.textContent = 'Formulário ainda não configurado (falta a access key).';
      status.className = 'form-status err';
      return;
    }
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    status.textContent = '';
    status.className = 'form-status';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (data.success) {
        status.textContent = 'Mensagem enviada! Retorno em breve. 🚀';
        status.className = 'form-status ok';
        form.reset();
      } else {
        throw new Error(data.message || 'Erro no envio');
      }
    } catch (err) {
      status.textContent = 'Não foi possível enviar. Tente pelo WhatsApp ou email.';
      status.className = 'form-status err';
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
}
