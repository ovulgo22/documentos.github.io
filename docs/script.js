// Pesquisa em tempo real
document.getElementById('searchInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        section.style.display = text.includes(filter) ? '' : 'none';
    });
});

// Scroll suave e fechar menu no celular
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
        if(window.innerWidth <= 992) document.querySelector('.sidebar').classList.remove('show');
    });
});

// Toggle submenu
document.querySelectorAll('.has-submenu').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        item.classList.toggle('active');
    });
});

// Toggle menu no celular/tablet
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('show');
});

// Tema escuro
document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Carregar tema salvo
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

// Botão voltar ao topo
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if(window.scrollY > 200) backToTop.style.display = 'block';
    else backToTop.style.display = 'none';
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
