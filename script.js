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

// Atualiza o banner de acordo com a categoria
function atualizarBanner(categoria) {
    const banner = document.getElementById("banner-destaques");
    if (!banner) return;
    
    // Se estiver em modo foco, mantém escondido
    if (document.body.classList.contains('modo-foco')) {
        banner.style.display = 'none';
        return;
    }

    banner.style.display = categoria === "todas" ? "block" : "none";
}

// Função para fechar o modo foco
function fecharResenha() {
    document.body.classList.remove('modo-foco');
    document.getElementById('resenha-detalhe').style.display = 'none';
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

        // Clique para abrir resenha em modo foco
        section.addEventListener('click', () => {
            document.body.classList.add('modo-foco');
            const detalhe = document.getElementById('conteudo-detalhe');
            detalhe.innerHTML = `
                <h2>${item.titulo}</h2>
                <p><strong>Autor:</strong> ${item.autor}</p>
                <p>${item.textoCompleto}</p>
            `;
            document.getElementById('resenha-detalhe').style.display = 'block';

            // Adiciona histórico para botão Voltar do navegador
            history.pushState({modoFoco: true}, '', '');
        });
    });
}

// Inicializa o site
async function init() {
    const resenhas = await carregarResenhas();

    let categoriaAtual = document.body?.dataset?.categoria || 'todas';

    // Exibe resenhas iniciais
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
            atualizarBanner(categoriaAtual);
        });
    });

    // Botão “Voltar” interno
    const btnFechar = document.getElementById('fechar-resenha');
    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            fecharResenha();
            if (history.state?.modoFoco) history.back();
        });
    }

    // Botão Voltar do navegador
    window.addEventListener('popstate', () => {
        if (document.body.classList.contains('modo-foco')) {
            fecharResenha();
        }
    });

    // Atualiza banner na inicialização
    atualizarBanner(categoriaAtual);
}

// Inicializa quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", init);