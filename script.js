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

function atualizarBanner(categoria) {
    const banner = document.getElementById("banner-destaques");
    if (!banner) return; // evita erro se não existir
    banner.style.display = categoria === "todas" ? "block" : "none";
}

// Ao carregar a página
let categoriaAtual = document.body.dataset.categoria || 'todas';
atualizarBanner(categoriaAtual);

// Ao clicar nos links do menu
document.querySelectorAll('nav a[data-categoria]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        categoriaAtual = link.dataset.categoria || 'todas';
        atualizarBanner(categoriaAtual);
    });
});

// Função para exibir resenhas no HTML
function exibirResenhas(resenhas, categoria = 'todas') {
    const container = document.getElementById('resenhas');
    if (!container) return;

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

// Clique para abrir resenha em modo foco
section.addEventListener('click', () => {
    document.body.classList.add('modo-foco'); // aplica modo foco no CSS
    const detalhe = document.getElementById('conteudo-detalhe');
    detalhe.innerHTML = `
        <h2>${item.titulo}</h2>
        <p><strong>Autor:</strong> ${item.autor}</p>
        <p>${item.textoCompleto}</p>
    `;
    document.getElementById('resenha-detalhe').style.display = 'block';
});
    });
}

document.getElementById('fechar-resenha').addEventListener('click', () => {
    document.body.classList.remove('modo-foco');
    document.getElementById('resenha-detalhe').style.display = 'none';
});

// Função principal
async function init() {
    const resenhas = await carregarResenhas();

    // Determina categoria inicial a partir do body ou usa 'todas'
    let categoriaAtual = document.body?.dataset?.categoria || 'todas';

    exibirResenhas(resenhas, categoriaAtual);

    // Filtrar por categoria ao clicar no menu
    const linksMenu = document.querySelectorAll('nav a[data-categoria]');
    linksMenu.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Atualiza link ativo visualmente
            linksMenu.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');

            // Atualiza categoria e exibe resenhas
            categoriaAtual = link.dataset.categoria || 'todas';
            exibirResenhas(resenhas, categoriaAtual);
        });
    });
}

// Inicializa o site quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", init);