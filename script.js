// Dados do banner (personalizáveis)
const bannerData = [
    { image: 'placeholder1.jpg', title: 'Destaque 1', text: 'Explore um clássico do terror gótico.' },
    { image: 'placeholder2.jpg', title: 'Destaque 2', text: 'Um lançamento arrepiante de 2025.' },
    { image: 'placeholder3.jpg', title: 'Destaque 3', text: 'Obra-prima de um autor nacional.' }
];

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

// Função para atualizar o carrossel de banner
function atualizarBanner(categoria) {
    const banner = document.getElementById('banner-destaques');
    if (!banner) return;

    if (document.body.classList.contains('modo-foco') || categoria !== 'todas') {
        banner.classList.add('hidden');
        return;
    }

    banner.classList.remove('hidden');
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-rotaciona a cada 8 segundos
    let autoSlide = setInterval(nextSlide, 8000);

    // Controles manuais
    document.querySelector('.banner-prev').addEventListener('click', () => {
        clearInterval(autoSlide);
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        autoSlide = setInterval(nextSlide, 5000);
    });

    document.querySelector('.banner-next').addEventListener('click', () => {
        clearInterval(autoSlide);
        nextSlide();
        autoSlide = setInterval(nextSlide, 5000);
    });
}

// Função para fechar o modo foco
function fecharResenha() {
    document.body.classList.remove('modo-foco');
    document.getElementById('resenha-detalhe').classList.add('hidden');
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
        section.setAttribute('tabindex', '0');
        section.innerHTML = `
            <h2>${item.titulo}</h2>
            <p><strong>Autor:</strong> ${item.autor}</p>
            <p>${item.resumo}</p>
        `;
        container.appendChild(section);

        // Clique para abrir resenha em modo foco
        section.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll para o topo
            document.body.classList.add('modo-foco');
            const detalhe = document.getElementById('conteudo-detalhe');
            detalhe.innerHTML = `
                <h2>${item.titulo}</h2>
                <p><strong>Autor:</strong> ${item.autor}</p>
                <p>${item.textoCompleto}</p>
            `;
            document.getElementById('resenha-detalhe').classList.remove('hidden');
            history.pushState({ modoFoco: true }, '', '');
        });

        // Suporte para teclado
        section.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll para o topo
                section.click();
            }
        });
    });
}

// Função debounce para otimizar eventos
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Inicializa o site
async function init() {
    const resenhas = await carregarResenhas();
    let categoriaAtual = document.body.dataset.categoria || 'todas';

    // Exibe resenhas iniciais
    exibirResenhas(resenhas, categoriaAtual);

    // Filtrar por categoria
    const linksMenu = document.querySelectorAll('nav a[data-categoria]');
    linksMenu.forEach(link => {
        link.addEventListener('click', debounce((e) => {
            e.preventDefault();
            linksMenu.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');
            categoriaAtual = link.dataset.categoria || 'todas';
            document.body.dataset.categoria = categoriaAtual;
            exibirResenhas(resenhas, categoriaAtual);
            atualizarBanner(categoriaAtual);
        }, 200));
    });

    // Botão “Voltar” interno
    const btnFechar = document.getElementById('fechar-resenha');
    if (btnFechar) {
        btnFechar.addEventListener('click', debounce(() => {
            fecharResenha();
            if (history.state?.modoFoco) history.back();
        }, 200));
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
document.addEventListener('DOMContentLoaded', init);