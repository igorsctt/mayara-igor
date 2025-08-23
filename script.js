// ===== VARIÁVEIS GLOBAIS =====
let isMusicPlaying = false;
let musicInitialized = false;

// ===== ELEMENTOS DOM =====
const introScreen = document.getElementById('intro-screen');
const invitationScreen = document.getElementById('invitation-screen');
const mainHeart = document.getElementById('main-heart');
const backButton = document.getElementById('back-button');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');
const photo = document.querySelector('.photo');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar música
    setupMusic();
    
    // Configurar eventos
    setupEventListeners();
    
    // Inicializar animações
    initializeAnimations();
    
    // Mostrar tela inicial
    showIntroScreen();
});

// ===== CONFIGURAÇÃO DA MÚSICA =====
function setupMusic() {
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3;
        backgroundMusic.preload = 'auto';
        
        // Event listeners para a música
        backgroundMusic.addEventListener('loadeddata', () => {
            console.log('Música carregada');
            musicInitialized = true;
        });
        
        backgroundMusic.addEventListener('error', (e) => {
            console.warn('Erro ao carregar música:', e);
            // Esconder controle se não houver música
            if (musicToggle) {
                musicToggle.style.display = 'none';
            }
        });
        
        backgroundMusic.addEventListener('ended', () => {
            // Reiniciar música quando terminar
            backgroundMusic.currentTime = 0;
            backgroundMusic.play();
        });
    }
}

// ===== CONTROLE DA MÚSICA =====
function toggleMusic() {
    if (!backgroundMusic || !musicInitialized) return;
    
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    if (!backgroundMusic || !musicInitialized) return;
    
    backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        updateMusicButton(true);
        
        // Adicionar efeito de batida na foto
        if (photo) {
            photo.classList.add('music-beat');
        }
    }).catch((error) => {
        console.warn('Não foi possível reproduzir música:', error);
        // Em caso de erro, aguardar interação do usuário
        updateMusicButton(false);
    });
}

function pauseMusic() {
    if (!backgroundMusic) return;
    
    backgroundMusic.pause();
    isMusicPlaying = false;
    updateMusicButton(false);
    
    // Remover efeito de batida na foto
    if (photo) {
        photo.classList.remove('music-beat');
    }
}

function updateMusicButton(playing) {
    if (!musicToggle) return;
    
    const musicIcon = musicToggle.querySelector('.music-icon');
    if (playing) {
        musicToggle.classList.add('playing');
        musicIcon.textContent = '🎵';
        musicToggle.title = 'Pausar música';
    } else {
        musicToggle.classList.remove('playing');
        musicIcon.textContent = '🔇';
        musicToggle.title = 'Reproduzir música';
    }
}

// ===== NAVEGAÇÃO ENTRE TELAS =====
function showIntroScreen() {
    introScreen.classList.add('active');
    invitationScreen.classList.remove('active');
    
    // Reiniciar animações dos corações
    restartHeartsAnimation();
}

function showInvitationScreen() {
    // Trocar telas
    introScreen.classList.remove('active');
    setTimeout(() => {
        invitationScreen.classList.add('active');
        
        // Adicionar animações de entrada
        addEntranceAnimations();
        
        // Criar confetes
        createConfetti();
        
        // Adicionar efeito de digitação
        setTimeout(() => {
            addTypingEffect();
        }, 1000);
        
    }, 500);
}

// ===== ANIMAÇÕES =====
function initializeAnimations() {
    // Criar corações extras dinamicamente
    createFloatingHearts();
    
    // Inicializar animações de entrada
    setTimeout(() => {
        addFadeInAnimations();
    }, 500);
}

function restartHeartsAnimation() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        heart.style.animation = 'none';
        setTimeout(() => {
            heart.style.animation = '';
        }, 10);
    });
}

function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-animation');
    if (!heartsContainer) return;
    
    // Adicionar mais corações dinamicamente
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '♥';
        heart.style.setProperty('--delay', Math.random() * 3 + 's');
        heart.style.setProperty('--x', Math.random() * 100 + '%');
        heart.style.fontSize = (1.5 + Math.random() * 1) + 'rem';
        heart.style.opacity = 0.4 + Math.random() * 0.4;
        
        heartsContainer.appendChild(heart);
        
        // Remover após animação
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 8000);
    }
}

function addEntranceAnimations() {
    const leftSide = document.querySelector('.invitation-left');
    const rightSide = document.querySelector('.invitation-right');
    
    if (leftSide) {
        leftSide.classList.add('slide-in-left');
    }
    
    if (rightSide) {
        rightSide.classList.add('slide-in-right');
    }
    
    // Animar cards com delay
    const cards = document.querySelectorAll('.detail-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 300 + (index * 200));
    });
}

function addFadeInAnimations() {
    const elements = document.querySelectorAll('.intro-title, .intro-subtitle');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in');
        }, index * 300);
    });
}

function addTypingEffect() {
    const messageText = document.querySelector('.message-text');
    if (!messageText) return;
    
    const originalText = messageText.innerHTML;
    messageText.innerHTML = '';
    
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < originalText.length) {
            messageText.innerHTML = originalText.slice(0, index + 1) + '<span class="typing-cursor">|</span>';
            index++;
        } else {
            clearInterval(typeInterval);
            messageText.innerHTML = originalText; // Remove cursor
        }
    }, 30);
}

// ===== EFEITOS ESPECIAIS =====
function createConfetti() {
    const colors = ['#d4af37', '#f4e4bc', '#e8c547', '#f8d7da', '#e91e63'];
    const container = document.body;
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.borderRadius = '50%';
            confetti.style.opacity = '0.8';
            
            container.appendChild(confetti);
            
            // Animar confete
            const animation = confetti.animate([
                {
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: 0.8
                },
                {
                    transform: `translateY(${window.innerHeight + 20}px) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            };
            
        }, i * 50);
    }
}

function createHeartExplosion(x, y) {
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '♥';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.color = '#e91e63';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1001';
        heart.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(heart);
        
        // Animar explosão
        const angle = (i / 12) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const duration = 1000 + Math.random() * 500;
        
        const animation = heart.animate([
            {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${-50 + Math.cos(angle) * distance}px, ${-50 + Math.sin(angle) * distance}px) scale(0.3)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        };
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Clique no coração principal
    if (mainHeart) {
        mainHeart.addEventListener('click', function(e) {
            const rect = mainHeart.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Criar explosão de corações
            createHeartExplosion(x, y);
            
            // Efeito no coração
            mainHeart.style.transform = 'scale(1.3)';
            setTimeout(() => {
                mainHeart.style.transform = '';
            }, 300);
            
            // Tentar inicializar e tocar música imediatamente
            if (backgroundMusic && !isMusicPlaying) {
                backgroundMusic.currentTime = 0;
                backgroundMusic.play().then(() => {
                    console.log('Música iniciada com sucesso');
                    isMusicPlaying = true;
                    musicInitialized = true;
                    if (musicToggle) {
                        musicToggle.textContent = '🔊';
                    }
                }).catch(error => {
                    console.warn('Erro ao tocar música:', error);
                });
            }
            
            // Mostrar convite após delay
            setTimeout(() => {
                showInvitationScreen();
            }, 800);
        });
        
        // Efeitos hover no coração
        mainHeart.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-10px)';
        });
        
        mainHeart.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
    
    // Botão voltar
    if (backButton) {
        backButton.addEventListener('click', function() {
            showIntroScreen();
        });
    }
    
    // Controle de música
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Elementos decorativos interativos
    setupDecorativeElements();
    
    // Efeito parallax sutil
    setupParallaxEffect();
}

function setupDecorativeElements() {
    // Corações decorativos
    const decoHearts = document.querySelectorAll('.deco-heart');
    decoHearts.forEach(heart => {
        heart.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Mini explosão
            createHeartExplosion(x, y);
        });
    });
    
    // Flores decorativas
    const decoFlowers = document.querySelectorAll('.deco-flower');
    decoFlowers.forEach(flower => {
        flower.addEventListener('click', function() {
            this.style.transform = 'scale(1.5) rotate(180deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 400);
        });
    });
}

function setupParallaxEffect() {
    document.addEventListener('mousemove', function(e) {
        const hearts = document.querySelectorAll('.heart');
        const particles = document.querySelectorAll('.particle');
        
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        hearts.forEach((heart, index) => {
            const speed = (index % 3 + 1) * 0.3;
            const x = mouseX * speed * 10;
            const y = mouseY * speed * 10;
            heart.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        particles.forEach((particle, index) => {
            const speed = (index % 2 + 1) * 0.2;
            const x = mouseX * speed * 5;
            const y = mouseY * speed * 5;
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===== FUNÇÕES UTILITÁRIAS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== RECURSOS ADICIONAIS =====
function addRandomFloatingElement() {
    if (introScreen.classList.contains('active')) {
        createFloatingHearts();
    }
}

// Adicionar elementos flutuantes periodicamente
setInterval(addRandomFloatingElement, 3000);

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', function(e) {
    console.warn('Erro capturado:', e.error);
    // Não mostrar erros para o usuário, apenas log
});

// ===== PERFORMANCE =====
// Otimizar animações para dispositivos com baixo desempenho
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.classList.add('low-performance');
}

// ===== ACESSIBILIDADE =====
// Respeitar preferências de movimento reduzido
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
}

// ===== DETECTAR INTERAÇÃO INICIAL =====
let userHasInteracted = false;
function markUserInteraction() {
    if (!userHasInteracted) {
        userHasInteracted = true;
        // Tentar reproduzir música após primeira interação
        if (!isMusicPlaying && musicInitialized) {
            playMusic();
        }
    }
}

['click', 'touchstart', 'keydown'].forEach(eventType => {
    document.addEventListener(eventType, markUserInteraction, { once: true });
});

// ===== FUNCIONALIDADE WHATSAPP CONFIRMAÇÃO =====
let selectedCount = 1; // Número padrão de pessoas

// Configurar seleção de quantidade
document.addEventListener('DOMContentLoaded', function() {
    setupRSVPButtons();
});

function setupRSVPButtons() {
    // Botões de quantidade de pessoas
    const countButtons = document.querySelectorAll('.count-btn');
    countButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover seleção anterior
            countButtons.forEach(b => b.classList.remove('selected'));
            
            // Adicionar seleção atual
            this.classList.add('selected');
            selectedCount = parseInt(this.dataset.count);
        });
    });
    
    // Selecionar 1 pessoa por padrão
    if (countButtons.length > 0) {
        countButtons[0].classList.add('selected');
    }
    
    // Botão de confirmação SIM
    const confirmYes = document.getElementById('confirm-yes');
    if (confirmYes) {
        confirmYes.addEventListener('click', function() {
            sendWhatsAppConfirmation(true);
        });
    }
    
    // Botão de confirmação NÃO
    const confirmNo = document.getElementById('confirm-no');
    if (confirmNo) {
        confirmNo.addEventListener('click', function() {
            sendWhatsAppConfirmation(false);
        });
    }
}

function sendWhatsAppConfirmation(isConfirming) {
    // Número do WhatsApp dos noivos (substitua pelo número real)
    const phoneNumber = '5519995393168'; // Formato: país + DDD + número
    
    let message;
    if (isConfirming) {
        const peopleText = selectedCount === 1 ? 'pessoa' : 'pessoas';
        message = `*CONFIRMAÇÃO DE PRESENÇA* \n\n` +
                 `*SIM*, confirmo minha presença no casamento!\n\n` +
                 `*Quantidade de pessoas:* ${selectedCount} ${peopleText}\n\n` +
                 `Estamos muito felizes em celebrar este momento especial com vocês!\n\n` +
                 `*Mayara & Igor*`;
    } else {
        message = `*NÃO PODEREI COMPARECER*\n\n` +
                 `Infelizmente não poderei estar presente no casamento.\n\n` +
                 `Mesmo assim, desejo toda a felicidade do mundo para vocês!\n\n` +
                 `*Mayara & Igor*`;
    }
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Criar URL do WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
}

// ===== FUNCIONALIDADE DA GALERIA DE FOTOS - CARROSSEL =====
let currentSlide = 0;
const totalSlides = 5;
let carouselInterval;

function setupPhotoCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carouselTrack || indicators.length === 0) return;
    
    // Configurar indicadores clicáveis
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            restartCarouselTimer();
        });
    });
    
    // Iniciar carrossel automático
    startCarouselTimer();
    
    // Pausar ao passar mouse sobre a galeria
    const gallery = document.querySelector('.photo-gallery');
    if (gallery) {
        gallery.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        gallery.addEventListener('mouseleave', () => {
            startCarouselTimer();
        });
    }
}

function goToSlide(slideIndex) {
    const carouselTrack = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carouselTrack) return;
    
    currentSlide = slideIndex;
    
    // Mover o carrossel
    const translateX = -currentSlide * 25; // 25% por slide
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Atualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
}

function startCarouselTimer() {
    carouselInterval = setInterval(nextSlide, 4000); // 4 segundos
}

function restartCarouselTimer() {
    clearInterval(carouselInterval);
    startCarouselTimer();
}

// Efeitos de interação nas fotos
function setupPhotoEffects() {
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            // Efeito de clique na foto
            this.style.transform += ' scale(0.95)';
            setTimeout(() => {
                this.style.transform = this.style.transform.replace('scale(0.95)', '');
            }, 150);
            
            // Adicionar efeito de brilho temporário
            const sparkle = document.createElement('div');
            sparkle.className = 'photo-sparkle';
            sparkle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: sparkleEffect 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 100;
            `;
            
            this.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 600);
        });
    });
}

// Adicionar animação sparkle ao CSS dinamicamente
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleEffect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Inicializar galeria de fotos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        setupPhotoCarousel();
        setupPhotoEffects();
        setupPixGiftSection(); // Inicializar seção de presentes PIX
    }, 500); // Pequeno delay para garantir que elementos estejam prontos
});

// ===== SEÇÃO DE PRESENTES PIX =====
function setupPixGiftSection() {
    const pixCodeInput = document.getElementById('pix-code');
    const copyButton = document.getElementById('copy-pix-code');
    
    if (!pixCodeInput || !copyButton) return;
    
    // Configurar botão de cópia
    copyButton.addEventListener('click', function() {
        copyPixCode(pixCodeInput, copyButton);
    });
    
    // Permitir cópia clicando no input também
    pixCodeInput.addEventListener('click', function() {
        this.select();
        copyPixCode(pixCodeInput, copyButton);
    });
}

function copyPixCode(input, button) {
    try {
        // Selecionar o texto
        input.select();
        input.setSelectionRange(0, 99999); // Para mobile
        
        // Copiar para clipboard
        navigator.clipboard.writeText(input.value).then(() => {
            showCopySuccess(button);
        }).catch(() => {
            // Fallback para navegadores antigos
            document.execCommand('copy');
            showCopySuccess(button);
        });
        
    } catch (error) {
        console.warn('Erro ao copiar código PIX:', error);
        // Mostrar mensagem de erro amigável
        showCopyError(button);
    }
}

function showCopySuccess(button) {
    const originalHTML = button.innerHTML;
    const originalStyle = button.style.cssText;
    
    // Animar sucesso
    button.innerHTML = '<span class="copy-icon">✅</span>';
    button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    button.style.transform = 'scale(1.1)';
    
    // Criar notificação de sucesso
    showNotification('✅ Código PIX copiado com sucesso!', 'success');
    
    // Restaurar botão após animação
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.cssText = originalStyle;
    }, 2000);
}

function showCopyError(button) {
    const originalHTML = button.innerHTML;
    const originalStyle = button.style.cssText;
    
    // Animar erro
    button.innerHTML = '<span class="copy-icon">❌</span>';
    button.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    button.style.animation = 'shake 0.5s ease-in-out';
    
    // Criar notificação de erro
    showNotification('❌ Não foi possível copiar. Tente selecionar e copiar manualmente.', 'error');
    
    // Restaurar botão
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.cssText = originalStyle;
    }, 2000);
}

function showNotification(message, type) {
    // Remover notificação existente
    const existingNotification = document.querySelector('.pix-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = 'pix-notification';
    
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
        : 'linear-gradient(135deg, #e74c3c, #c0392b)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-family: 'Playfair Display', serif;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInNotification 0.3s ease-out forwards;
        max-width: 300px;
        text-align: center;
        line-height: 1.4;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Adicionar animações de notificação ao CSS
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInNotification {
        0% { 
            opacity: 0; 
            transform: translateX(100%) translateY(-20px); 
        }
        100% { 
            opacity: 1; 
            transform: translateX(0) translateY(0); 
        }
    }
    
    @keyframes slideOutNotification {
        0% { 
            opacity: 1; 
            transform: translateX(0) translateY(0); 
        }
        100% { 
            opacity: 0; 
            transform: translateX(100%) translateY(-20px); 
        }
    }
`;
document.head.appendChild(notificationStyle);

// Adicionar animação shake ao CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

console.log('🎉 Convite de Casamento - Mayara & Igor inicializado com sucesso!');
