/**
 * Classe que gerencia o foguete
 */
class Rocket {
    /**
     * Inicializa o foguete
     * @param {HTMLElement} element - Elemento HTML do foguete
     * @param {HTMLElement} flameElement - Elemento HTML da chama
     * @param {ParticleSystem} particleSystem - Sistema de partículas
     */
    constructor(element, flameElement, particleSystem) {
        this.element = element;
        this.flameElement = flameElement;
        this.particleSystem = particleSystem;
        
        // Dimensões
        this.width = CONFIG.ROCKET.WIDTH;
        this.height = CONFIG.ROCKET.HEIGHT;
        
        // Posição e velocidade
        this.x = 0;
        this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Ângulo e propulsão
        this.angle = 0;
        this.thrusting = false;
        
        // Combustível
        this.fuel = CONFIG.ROCKET.INITIAL_FUEL;
        
        // Controles
        this.setupControls();
    }
    
    /**
     * Configura os controles do foguete
     */
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') {
                this.thrusting = true;
            }
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                this.rotateLeft();
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                this.rotateRight();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') {
                this.thrusting = false;
            }
        });
    }
    
    /**
     * Rotaciona o foguete para a esquerda
     */
    rotateLeft() {
        this.angle = Math.max(-CONFIG.ROCKET.MAX_ANGLE, this.angle - CONFIG.ROCKET.ROTATION_SPEED);
    }
    
    /**
     * Rotaciona o foguete para a direita
     */
    rotateRight() {
        this.angle = Math.min(CONFIG.ROCKET.MAX_ANGLE, this.angle + CONFIG.ROCKET.ROTATION_SPEED);
    }
    
    /**
     * Reinicia o foguete para uma nova partida
     * @param {number} containerWidth - Largura do contêiner
     * @param {number} containerHeight - Altura do contêiner
     */
    reset(containerWidth, containerHeight) {
        // Posição inicial
        this.x = containerWidth / 2 - this.width / 2;
        this.y = 50;
        
        // Velocidade inicial
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Ângulo inicial
        this.angle = 0;
        
        // Combustível inicial
        this.fuel = CONFIG.ROCKET.INITIAL_FUEL;
        
        // Atualiza a posição visual
        this.updatePosition();
    }
    
    /**
     * Atualiza a física do foguete
     * @param {number} gravity - Força da gravidade
     * @param {number} windStrength - Força do vento
     * @param {number} windDirection - Direção do vento
     * @param {number} containerWidth - Largura do contêiner
     * @param {number} containerHeight - Altura do contêiner
     * @returns {Object} - Estado atual do foguete
     */
    update(gravity, windStrength, windDirection, containerWidth, containerHeight) {
        // Aplica a gravidade
        this.velocityY += gravity;
        
        // Aplica o vento lateralmente
        this.velocityX += windStrength * windDirection;
        
        // Aplica o empuxo se estiver propulsionando e tiver combustível
        if (this.thrusting && this.fuel > 0) {
            // Calcula os componentes do empuxo com base no ângulo
            const thrustAngleRad = Utils.degreesToRadians(this.angle);
            this.velocityY -= CONFIG.THRUST * Math.cos(thrustAngleRad);
            this.velocityX += CONFIG.THRUST * Math.sin(thrustAngleRad);
            
            // Consome combustível
            this.fuel -= CONFIG.ROCKET.FUEL_CONSUMPTION;
            
            // Mostra a chama
            this.flameElement.style.display = 'block';
            
            // Cria partículas de propulsão
            if (Math.random() > 0.5) {
                this.particleSystem.createThrustParticle(this.x, this.y, this.angle);
            }
        } else {
            // Esconde a chama
            this.flameElement.style.display = 'none';
        }
        
        // Limita o consumo de combustível
        this.fuel = Math.max(0, this.fuel);
        
        // Atualiza a posição
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Verifica colisão com as bordas
        if (this.x < 0) {
            this.x = 0;
            this.velocityX *= -0.5; // Rebate com perda de energia
        }
        if (this.x > containerWidth - this.width) {
            this.x = containerWidth - this.width;
            this.velocityX *= -0.5; // Rebate com perda de energia
        }
        
        // Atualiza a posição visual
        this.updatePosition();
        
        // Retorna o estado atual para verificação de colisão
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            velocityY: this.velocityY,
            angle: this.angle,
            fuel: this.fuel
        };
    }
    
    /**
     * Atualiza a posição visual do foguete
     */
    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.transform = `rotate(${this.angle}deg)`;
    }
    
    /**
     * Cria uma explosão na posição atual do foguete
     */
    explode() {
        this.particleSystem.createExplosion(this.x + this.width / 2, this.y + this.height / 2, 30);
        this.element.style.display = 'none';
    }
} 