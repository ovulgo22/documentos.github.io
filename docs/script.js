// Função de pesquisa simples
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
