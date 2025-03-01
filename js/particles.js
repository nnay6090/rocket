/**
 * Sistema de partículas para efeitos visuais
 */

class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
    }
    
    /**
     * Cria uma partícula de vento
     * @param {number} windDirection - Direção do vento (1 = direita, -1 = esquerda)
     * @param {number} windStrength - Força do vento
     */
    createWindParticle(windDirection, windStrength) {
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        
        const particle = document.createElement('div');
        particle.className = 'wind-particle';
        
        let x, y;
        
        if (windDirection > 0) {
            // Vento para a direita - partículas vêm da esquerda
            x = -5;
        } else {
            // Vento para a esquerda - partículas vêm da direita
            x = containerWidth + 5;
        }
        
        y = Utils.random(0, containerHeight);
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        this.container.appendChild(particle);
        
        const particleSpeed = Math.abs(windStrength) * CONFIG.WIND.PARTICLE_SPEED_MULTIPLIER + 2;
        
        this.particles.push({
            element: particle,
            x: x,
            y: y,
            speed: particleSpeed,
            direction: windDirection,
            type: 'wind'
        });
    }
    
    /**
     * Cria uma partícula de explosão
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} count - Quantidade de partículas
     */
    createExplosion(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.position = 'absolute';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.backgroundColor = `rgb(${Utils.random(200, 255)}, ${Utils.random(100, 150)}, 0)`;
            particle.style.borderRadius = '50%';
            
            const angle = Utils.random(0, Math.PI * 2);
            const speed = Utils.random(1, 5);
            const life = Utils.random(30, 60);
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            this.container.appendChild(particle);
            
            this.particles.push({
                element: particle,
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: life,
                maxLife: life,
                type: 'explosion'
            });
        }
    }
    
    /**
     * Cria partículas de propulsão do foguete
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} angle - Ângulo do foguete em graus
     */
    createThrustParticle(x, y, angle) {
        const particle = document.createElement('div');
        particle.className = 'thrust-particle';
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = Utils.random(0, 1) > 0.5 ? 'orange' : 'yellow';
        particle.style.borderRadius = '50%';
        
        // Converte o ângulo para radianos e ajusta para a direção correta
        const radians = Utils.degreesToRadians(angle);
        
        // Posiciona a partícula na base do foguete
        const offsetX = 10 + Math.sin(radians) * 20;
        const offsetY = 40 + Math.cos(radians) * 20;
        
        particle.style.left = (x + offsetX) + 'px';
        particle.style.top = (y + offsetY) + 'px';
        
        this.container.appendChild(particle);
        
        // Velocidade na direção oposta ao foguete
        const speed = Utils.random(1, 3);
        const life = Utils.random(10, 20);
        
        this.particles.push({
            element: particle,
            x: x + offsetX,
            y: y + offsetY,
            vx: Math.sin(radians) * speed,
            vy: Math.cos(radians) * speed,
            life: life,
            maxLife: life,
            type: 'thrust'
        });
    }
    
    /**
     * Atualiza todas as partículas
     */
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (particle.type === 'wind') {
                // Atualiza partículas de vento
                particle.x += particle.direction * particle.speed;
                particle.element.style.left = particle.x + 'px';
                
                // Remove partículas que saíram da tela
                if ((particle.direction > 0 && particle.x > this.container.clientWidth) || 
                    (particle.direction < 0 && particle.x < -5)) {
                    if (particle.element && particle.element.parentNode) {
                        particle.element.parentNode.removeChild(particle.element);
                    }
                    this.particles.splice(i, 1);
                }
            } else if (particle.type === 'explosion' || particle.type === 'thrust') {
                // Atualiza partículas de explosão e propulsão
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.type === 'explosion') {
                    // Adiciona gravidade às partículas de explosão
                    particle.vy += 0.1;
                }
                
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                
                // Diminui a vida da partícula
                particle.life--;
                
                // Ajusta a opacidade com base na vida restante
                const opacity = particle.life / particle.maxLife;
                particle.element.style.opacity = opacity;
                
                // Remove partículas mortas
                if (particle.life <= 0) {
                    if (particle.element && particle.element.parentNode) {
                        particle.element.parentNode.removeChild(particle.element);
                    }
                    this.particles.splice(i, 1);
                }
            }
        }
    }
    
    /**
     * Remove todas as partículas
     */
    clear() {
        for (const particle of this.particles) {
            if (particle.element && particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        }
        this.particles = [];
    }
} 