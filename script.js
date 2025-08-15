// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const contactForm = document.querySelector('.contact-form');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle do menu mobile
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animação do hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Scroll do header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .timeline-item, .stat, .contact-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Contador animado para estatísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(start));
            }
        }, 16);
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(0) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num + '+';
    }

    // Animar contadores quando visíveis
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target.querySelector('h3');
                const text = statElement.textContent;
                let targetNumber = 0;
                
                if (text.includes('10M')) {
                    targetNumber = 10000000;
                } else if (text.includes('700')) {
                    targetNumber = 700;
                } else if (text.includes('50')) {
                    targetNumber = 50;
                }
                
                if (targetNumber > 0) {
                    animateCounter(statElement, targetNumber);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envio do formulário
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Mensagem Enviada!';
                submitBtn.style.background = '#28a745';
                
                // Reset do formulário
                this.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 2000);
        });
    }

    // Validação em tempo real do formulário
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove classes anteriores
        field.classList.remove('error', 'success');
        
        // Validação por tipo
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        } else {
            isValid = value.length > 0;
        }
        
        // Aplicar classes
        if (value.length > 0) {
            field.classList.add(isValid ? 'success' : 'error');
        }
        
        return isValid;
    }

    // Efeito parallax sutil no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Destacar link ativo na navegação
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Lazy loading para imagens (se houver)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Adicionar estilos CSS dinâmicos para validação
    const style = document.createElement('style');
    style.textContent = `
        .contact-form input.error,
        .contact-form textarea.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        
        .contact-form input.success,
        .contact-form textarea.success {
            border-color: #28a745;
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }
        
        .nav-menu a.active {
            color: #0066cc;
        }
        
        .nav-menu a.active::after {
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);

    // Inicialização completa
    console.log('Site Águia Branca carregado com sucesso!');
});

// Função para scroll suave (fallback para navegadores antigos)
function smoothScroll(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Utilitários globais
window.aguiaBranca = {
    smoothScroll: smoothScroll,
    version: '1.0.0'
};