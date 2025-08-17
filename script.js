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
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Resenhas carregadas:', data); // Debug: Verifica os dados
        return data;
    } catch (error) {
        console.error('Erro ao carregar resenhas:', error);
        return [];
    }
}

// Função para atualizar o carrossel de banner
function atualizarBanner(categoria) {
    const banner = document.getElementById('banner-destaques');
    if (!banner) {
        console.warn('Elemento #banner-destaques não encontrado'); // Debug
        return;
    }

    if (document.body.classList.contains('modo-foco') || categoria !== 'todas') {
        banner.classList.add('hidden');
        return;
    }

    banner.classList.remove('hidden');
    const slides = document.querySelectorAll('.banner-slide');
    if (slides.length === 0) {
        console.warn('Nenhum .banner-slide encontrado'); // Debug
        return;
    }

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
    const prevButton = document.querySelector('.banner-prev');
    const nextButton = document.querySelector('.banner-next');
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            clearInterval(autoSlide);
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
            autoSlide = setInterval(nextSlide, 5000);
        });
    } else {
        console.warn('Botão .banner-prev não encontrado'); // Debug
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            clearInterval(autoSlide);
            nextSlide();
            autoSlide = setInterval(nextSlide, 5000);
        });
    } else {
        console.warn('Botão .banner-next não encontrado'); // Debug
    }
}

// Função para fechar o modo foco
function fecharResenha() {
    document.body.classList.remove('modo-foco');
    const resenhaDetalhe = document.getElementById('resenha-detalhe');
    if (resenhaDetalhe) {
        resenhaDetalhe.classList.add('hidden');
    } else {
        console.warn('Elemento #resenha-detalhe não encontrado'); // Debug
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Garante que volta ao topo
}

// Função para exibir resenhas no HTML
function exibirResenhas(resenhas, categoria = 'todas') {
    const container = document.getElementById('resenhas');
    if (!container) {
        console.warn('Elemento #resenhas não encontrado'); // Debug
        return;
    }

    container.innerHTML = '';

    const filtradas = categoria === 'todas'
        ? resenhas
        : resenhas.filter(r => r.categoria === categoria);

    if (filtradas.length === 0) {
        console.warn('Nenhuma resenha encontrada para a categoria:', categoria); // Debug
        container.innerHTML = '<p>Nenhuma resenha disponível.</p>';
        return;
    }

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
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.classList.add('modo-foco');
            const detalhe = document.getElementById('conteudo-detalhe');
            if (detalhe) {
                detalhe.innerHTML = `
                    <h2>${item.titulo}</h2>
                    <p><strong>Autor:</strong> ${item.autor}</p>
                    <p>${item.textoCompleto}</p>
                `;
            } else {
                console.warn('Elemento #conteudo-detalhe não encontrado'); // Debug
            }
            const resenhaDetalhe = document.getElementById('resenha-detalhe');
            if (resenhaDetalhe) {
                resenhaDetalhe.classList.remove('hidden');
            }
            history.pushState({ modoFoco: true }, '', '');
        });

        // Suporte para teclado
        section.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Força scroll para o topo na inicialização da página
    window.scrollTo({ top: 0, behavior: 'auto' });

    const resenhas = await carregarResenhas();
    let categoriaAtual = document.body.dataset.categoria || 'todas';

    // Exibe resenhas iniciais
    exibirResenhas(resenhas, categoriaAtual);

    // Filtrar por categoria
    const linksMenu = document.querySelectorAll('nav a[data-categoria]');
    if (linksMenu.length === 0) {
        console.warn('Nenhum link de menu com data-categoria encontrado'); // Debug
    }
    linksMenu.forEach(link => {
        link.addEventListener('click', debounce((e) => {
            e.preventDefault();
            linksMenu.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');
            categoriaAtual = link.dataset.categoria || 'todas';
            document.body.dataset.categoria = categoriaAtual;
            exibirResenhas(resenhas, categoriaAtual);
            atualizarBanner(categoriaAtual);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200));
    });

    // Botão “Voltar” interno
    const btnFechar = document.getElementById('fechar-resenha');
    if (btnFechar) {
        btnFechar.addEventListener('click', debounce(() => {
            fecharResenha();
            if (history.state?.modoFoco) history.back();
        }, 200));
    } else {
        console.warn('Botão #fechar-resenha não encontrado'); // Debug
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

// Desativa restauração de scroll do navegador
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}