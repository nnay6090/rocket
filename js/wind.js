/**
 * Classe que gerencia o vento
 */
class Wind {
    /**
     * Inicializa o sistema de vento
     * @param {HTMLElement} strengthDisplay - Elemento para exibir a força do vento
     * @param {HTMLElement} arrowDisplay - Elemento para exibir a direção do vento
     * @param {ParticleSystem} particleSystem - Sistema de partículas
     * @param {number} level - Nível atual do jogo
     */
    constructor(strengthDisplay, arrowDisplay, particleSystem, level = 1) {
        this.strengthDisplay = strengthDisplay;
        this.arrowDisplay = arrowDisplay;
        this.particleSystem = particleSystem;
        
        // Propriedades do vento
        this.strength = 0;
        this.direction = 1; // 1 = direita, -1 = esquerda
        this.changeTimer = 0;
        
        // Ajusta a força máxima do vento com base no nível
        this.maxStrength = CONFIG.WIND.MAX_STRENGTH + (level - 1) * CONFIG.LEVELS.WIND_INCREASE_PER_LEVEL;
        
        // Inicializa o vento
        this.update();
    }
    
    /**
     * Atualiza o vento
     */
    update() {
        // Gera uma força de vento aleatória entre -maxStrength e maxStrength
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.strength = (Math.random() * this.maxStrength).toFixed(3);
        
        // Atualiza a exibição do vento
        this.updateDisplay();
    }
    
    /**
     * Atualiza a exibição do vento na interface
     */
    updateDisplay() {
        // Atualiza o texto da força do vento
        this.strengthDisplay.textContent = (this.strength * 100).toFixed(1);
        
        // Atualiza a seta de direção
        this.arrowDisplay.textContent = this.direction > 0 ? '→' : '←';
        
        // Ajusta a cor baseada na intensidade do vento
        const intensity = Math.abs(this.strength) * 100 / this.maxStrength / 100;
        let windColor;
        
        if (intensity > 0.7) {
            windColor = 'red';
        } else if (intensity > 0.4) {
            windColor = 'yellow';
        } else {
            windColor = 'white';
        }
        
        this.strengthDisplay.style.color = windColor;
        this.arrowDisplay.style.color = windColor;
    }
    
    /**
     * Atualiza o sistema de vento a cada frame
     * @returns {Object} - Estado atual do vento
     */
    tick() {
        // Incrementa o temporizador de mudança
        this.changeTimer++;
        
        // Muda o vento a cada intervalo definido
        if (this.changeTimer >= CONFIG.WIND.CHANGE_INTERVAL) {
            this.update();
            this.changeTimer = 0;
        }
        
        // Cria partículas de vento com base na força do vento
        if (Math.random() < Math.abs(this.strength) * CONFIG.WIND.PARTICLE_CHANCE) {
            this.particleSystem.createWindParticle(this.direction, this.strength);
        }
        
        // Retorna o estado atual do vento
        return {
            strength: this.strength,
            direction: this.direction
        };
    }
    
    /**
     * Define o nível do vento
     * @param {number} level - Nível do jogo
     */
    setLevel(level) {
        this.maxStrength = CONFIG.WIND.MAX_STRENGTH + (level - 1) * CONFIG.LEVELS.WIND_INCREASE_PER_LEVEL;
        this.update();
    }
} 