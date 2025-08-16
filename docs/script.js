// Pesquisa simples
document.getElementById('searchInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const sections = document.querySelectorAll('main section');

    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(filter)) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
});

// Scroll suave para links da sidebar
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
