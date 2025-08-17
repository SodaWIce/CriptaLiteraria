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
        console.warn('Elemento #banner-destaques não encontrado');
        return;
    }

    if (document.body.classList.contains('modo-foco') || categoria !== 'todas') {
        banner.classList.add('hidden');
        return;
    }

    banner.classList.remove('hidden');
    const slides = document.querySelectorAll('.banner-slide');
    const indicatorsContainer = document.querySelector('.banner-indicators');
    if (slides.length === 0) {
        console.warn('Nenhum .banner-slide encontrado');
        return;
    }

    if (!indicatorsContainer) {
        console.warn('Elemento .banner-indicators não encontrado');
        return;
    }

    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Limpar indicadores existentes
    indicatorsContainer.innerHTML = '';

    // Criar bolinhas dinamicamente
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('banner-indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            clearInterval(autoSlide);
            goToSlide(index);
            autoSlide = setInterval(nextSlide, 5000);
        });
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.banner-indicator');

    // Função para atualizar a posição dos indicadores
    function updateIndicatorsPosition() {
        const activeSlide = document.querySelector('.banner-slide.active');
        const wrapper = activeSlide.querySelector('.banner-image-wrapper');
        if (wrapper && indicatorsContainer) {
            wrapper.appendChild(indicatorsContainer);
        } else {
            console.warn('Elemento .banner-image-wrapper não encontrado no slide ativo');
        }
    }

    // Função para mudar o slide
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        updateIndicatorsPosition(); // Atualizar posição das bolinhas
    }

    // Função para próximo slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Auto-rotaciona a cada 5 segundos
    let autoSlide = setInterval(nextSlide, 5000);

    // Funções para arrastar
    function startDrag(event) {
        isDragging = true;
        startPos = getPositionX(event);
        banner.style.cursor = 'grabbing';
        clearInterval(autoSlide);
    }

    function drag(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        banner.style.cursor = 'grab';
        const movedBy = currentTranslate - prevTranslate;

        // Determinar direção do arrasto
        if (movedBy < -100 && currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        } else if (movedBy > 100 && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
        currentTranslate = 0;
        prevTranslate = 0;
        autoSlide = setInterval(nextSlide, 5000);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Eventos para arrastar
    banner.addEventListener('mousedown', startDrag);
    banner.addEventListener('mousemove', drag);
    banner.addEventListener('mouseup', endDrag);
    banner.addEventListener('mouseleave', endDrag);
    banner.addEventListener('touchstart', startDrag);
    banner.addEventListener('touchmove', drag);
    banner.addEventListener('touchend', endDrag);

    // Pausar autoplay ao interagir
    banner.addEventListener('mouseenter', () => clearInterval(autoSlide));
    banner.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });

    // Inicializar posição das bolinhas
    updateIndicatorsPosition();
}

// Função para fechar o modo foco
function fecharResenha() {
    document.body.classList.remove('modo-foco');
    const resenhaDetalhe = document.getElementById('resenha-detalhe');
    if (resenhaDetalhe) {
        resenhaDetalhe.classList.add('hidden');
    } else {
        console.warn('Elemento #resenha-detalhe não encontrado');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para exibir resenhas no HTML
function exibirResenhas(resenhas, categoria = 'todas') {
    const container = document.getElementById('resenhas');
    if (!container) {
        console.warn('Elemento #resenhas não encontrado');
        return;
    }

    container.innerHTML = '';

    const filtradas = categoria === 'todas'
        ? resenhas
        : resenhas.filter(r => r.categoria === categoria);

    if (filtradas.length === 0) {
        console.warn('Nenhuma resenha encontrada para a categoria:', categoria);
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
                console.warn('Elemento #conteudo-detalhe não encontrado');
            }
            const resenhaDetalhe = document.getElementById('resenha-detalhe');
            if (resenhaDetalhe) {
                resenhaDetalhe.classList.remove('hidden');
            }
            history.pushState({ modoFoco: true }, '', '');
        });

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
    window.scrollTo({ top: 0, behavior: 'auto' });

    const resenhas = await carregarResenhas();
    let categoriaAtual = document.body.dataset.categoria || 'todas';

    exibirResenhas(resenhas, categoriaAtual);
    atualizarBanner(categoriaAtual);

    const linksMenu = document.querySelectorAll('nav a[data-categoria]');
    if (linksMenu.length === 0) {
        console.warn('Nenhum link de menu com data-categoria encontrado');
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

    const btnFechar = document.getElementById('fechar-resenha');
    if (btnFechar) {
        btnFechar.addEventListener('click', debounce(() => {
            fecharResenha();
            if (history.state?.modoFoco) history.back();
        }, 200));
    } else {
        console.warn('Botão #fechar-resenha não encontrado');
    }

    window.addEventListener('popstate', () => {
        if (document.body.classList.contains('modo-foco')) {
            fecharResenha();
        }
    });
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);

// Desativa restauração de scroll do navegador
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}