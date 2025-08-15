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

// Função para exibir ou ocultar o banner
function atualizarBanner(categoria) {
    const banner = document.getElementById("banner-destaques");
    if (categoria === "todas") {
        banner.style.display = "block";
    } else {
        banner.style.display = "none";
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

    // Exibe resenhas iniciais da categoria atual
    let categoriaAtual = document.body.dataset.categoria || 'todas';
    exibirResenhas(resenhas, categoriaAtual);
    atualizarBanner(categoriaAtual);

    // Filtrar por categoria ao clicar no menu
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove classe 'ativo' de todos os links
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('ativo'));

            // Marca o link clicado como ativo
            link.classList.add('ativo');

            // Atualiza categoria com base no link
            categoriaAtual = link.dataset.categoria || 'todas';

            // Exibe resenhas e atualiza banner
            exibirResenhas(resenhas, categoriaAtual);
            atualizarBanner(categoriaAtual);
        });
    });
}

// Inicializa o site
document.addEventListener("DOMContentLoaded", init);