// Função para carregar as resenhas do JSON
async function carregarResenhas() {
    try {
        const response = await fetch('resenhas.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar resenhas:', error);
        return [];
    }
}

// Função para exibir resenhas no HTML
function exibirResenhas(resenhas, categoria = 'todas') {
    const container = document.getElementById('resenhas');
    container.innerHTML = '';

    const filtradas = categoria === 'todas'
        ? resenhas
        : resenhas.filter(r => r.categoria === categoria);

    filtradas.forEach(item => {
        const section = document.createElement('section');
        section.className = 'resenha';
        section.innerHTML = `
            <h2>${item.titulo}</h2>
            <p><strong>Autor:</strong> ${item.autor}</p>
            <p>${item.resumo}</p>
        `;
        container.appendChild(section);
    });
}

// Função principal
async function init() {
    const resenhas = await carregarResenhas();
    exibirResenhas(resenhas);

    // Filtrar por categoria ao clicar no menu
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
    e.preventDefault(); // impede recarregamento da página
    const categoria = link.getAttribute('data-categoria');

    // Mostrar ou esconder banner
    const banner = document.getElementById('banner-destaques');
    if(banner) {
        banner.style.display = categoria === 'todas' ? 'block' : 'none';
    }

    // Atualiza resenhas
    exibirResenhas(resenhas, categoria);
});
    });
}

// Inicializa o site
init();