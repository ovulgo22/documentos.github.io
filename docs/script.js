// Pesquisa em tempo real
document.getElementById('searchInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        section.style.display = text.includes(filter) ? '' : 'none';
    });
});

// Scroll suave para links
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });

        // Fechar menu no celular
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
