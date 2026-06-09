// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  navLinks.classList.contains('open')
    ? (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
       spans[1].style.opacity = '0',
       spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)')
    : (spans[0].style.transform = '',
       spans[1].style.opacity = '',
       spans[2].style.transform = '');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navItems.forEach(link => {
    link.classList.toggle('active-nav', link.getAttribute('href') === '#' + current);
  });
});

// Services tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.about-content, .about-visual, .doctor-card, .service-card, ' +
  '.why-point, .why-card, .contact-card, .trust-item'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Stagger child animations
document.querySelectorAll('.services-grid, .doctors-grid, .why-points').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });
});

// --- Simple i18n loader ---
const DEFAULT_LANG = 'en';
const SUPPORTED = ['en','hi'];
function setDocumentLang(lang){
  try{ document.documentElement.lang = lang; }catch(e){}
}

async function loadTranslations(lang){
  if(!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
  const url = `lang/${lang}.json`;
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('lang file not found');
    const data = await res.json();
    applyTranslations(data);
    setDocumentLang(lang);
    localStorage.setItem('site_lang', lang);
    // mark active button
    document.querySelectorAll('.lang-btn').forEach(b=> b.classList.toggle('active', b.dataset.lang===lang));
  }catch(err){
    if(lang !== DEFAULT_LANG) loadTranslations(DEFAULT_LANG);
    console.warn('i18n load failed', err);
  }
}

function applyTranslations(obj, prefix=''){
  Object.keys(obj).forEach(k => {
    const val = obj[k];
    if(typeof val === 'string'){
      const key = prefix ? `${prefix}.${k}` : k;
      document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => {
        // element may want to set different attributes
        const attr = el.dataset.i18nAttr || 'text';
        if(attr === 'html') el.innerHTML = val;
        else el.textContent = val;
      });
    } else if(typeof val === 'object'){
      const newPrefix = prefix ? `${prefix}.${k}` : k;
      applyTranslations(val, newPrefix);
    }
  });
}

// initialize language buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      loadTranslations(btn.dataset.lang);
    });
  });
  const stored = localStorage.getItem('site_lang') || (navigator.language && navigator.language.startsWith('hi') ? 'hi' : 'en');
  loadTranslations(stored);
});
