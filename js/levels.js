/**
 * Classe que gerencia os níveis do jogo
 */
class LevelManager {
    /**
     * Inicializa o gerenciador de níveis
     * @param {HTMLElement} landingPad - Elemento da plataforma de pouso
     * @param {HTMLElement} levelCompleteScreen - Tela de nível completo
     * @param {HTMLElement} levelPointsDisplay - Elemento para exibir a pontuação do nível
     * @param {HTMLElement} nextLevelBtn - Botão para próximo nível
     */
    constructor(landingPad, levelCompleteScreen, levelPointsDisplay, nextLevelBtn) {
        this.landingPad = landingPad;
        this.levelCompleteScreen = levelCompleteScreen;
        this.levelPointsDisplay = levelPointsDisplay;
        this.nextLevelBtn = nextLevelBtn;
        
        // Nível atual
        this.currentLevel = 1;
        
        // Configurações do nível atual
        this.gravity = CONFIG.GRAVITY;
        this.padWidth = 100; // Largura inicial da plataforma
        
        // Configura o evento do botão de próximo nível
        this.nextLevelBtn.addEventListener('click', () => {
            this.levelCompleteScreen.style.display = 'none';
            this.nextLevel();
            
            // Dispara um evento personalizado para notificar o jogo
            const event = new CustomEvent('levelAdvance');
            document.dispatchEvent(event);
        });
    }
    
    /**
     * Configura o nível atual
     * @param {number} containerWidth - Largura do contêiner
     */
    setupLevel(containerWidth) {
        // Ajusta a gravidade com base no nível
        this.gravity = CONFIG.GRAVITY + (this.currentLevel - 1) * CONFIG.LEVELS.GRAVITY_INCREASE_PER_LEVEL;
        
        // Ajusta a largura da plataforma com base no nível
        this.padWidth = Math.max(30, 100 - (this.currentLevel - 1) * CONFIG.LEVELS.PAD_WIDTH_DECREASE_PER_LEVEL);
        
        // Posiciona a plataforma de pouso
        const padX = containerWidth / 2 - this.padWidth / 2;
        this.landingPad.style.width = this.padWidth + 'px';
        this.landingPad.style.left = padX + 'px';
    }
    
    /**
     * Avança para o próximo nível
     */
    nextLevel() {
        if (this.currentLevel < CONFIG.LEVELS.COUNT) {
            this.currentLevel++;
        } else {
            // Se atingiu o nível máximo, reinicia no nível 1 com dificuldade aumentada
            this.currentLevel = 1;
        }
    }
    
    /**
     * Reinicia o nível atual
     */
    resetLevel() {
        // Não muda o nível, apenas reconfigura
    }
    
    /**
     * Mostra a tela de nível completo
     * @param {number} score - Pontuação do nível
     */
    showLevelComplete(score) {
        this.levelPointsDisplay.textContent = score;
        this.levelCompleteScreen.style.display = 'block';
    }
    
    /**
     * Verifica se o foguete pousou na plataforma
     * @param {Object} rocket - Estado do foguete
     * @returns {boolean} - Verdadeiro se o foguete está sobre a plataforma
     */
    isOverPad(rocket) {
        const padLeft = parseInt(this.landingPad.style.left);
        const padRight = padLeft + this.padWidth;
        
        return rocket.x + rocket.width / 2 > padLeft && rocket.x + rocket.width / 2 < padRight;
    }
    
    /**
     * Obtém as configurações do nível atual
     * @returns {Object} - Configurações do nível
     */
    getCurrentLevelConfig() {
        return {
            level: this.currentLevel,
            gravity: this.gravity,
            padWidth: this.padWidth,
            padPosition: parseInt(this.landingPad.style.left)
        };
    }
} 