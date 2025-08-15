// Função para exibir ou ocultar o banner de destaques
function atualizarBanner(categoria) {
    const banner = document.getElementById("banner-destaques");
    if (!banner) return; // evita erros se o banner não existir
    banner.style.display = categoria === "todas" ? "block" : "none";
}

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
    });
}

// Função principal
async function init() {
    const resenhas = await carregarResenhas();

    // Determina categoria inicial a partir do body ou usa 'todas'
    let categoriaAtual = document.body?.dataset?.categoria || 'todas';

    exibirResenhas(resenhas, categoriaAtual);
    atualizarBanner(categoriaAtual);

    // Filtrar por categoria ao clicar no menu
    const linksMenu = document.querySelectorAll('nav a[data-categoria]');
    linksMenu.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Atualiza link ativo visualmente
            linksMenu.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');

            // Atualiza categoria e aplica mudanças
            categoriaAtual = link.dataset.categoria || 'todas';
            exibirResenhas(resenhas, categoriaAtual);
            atualizarBanner(categoriaAtual);
        });
    });
}

// Inicializa o site quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", init);