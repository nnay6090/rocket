/**
 * Classe principal do jogo
 */
class Game {
    /**
     * Inicializa o jogo
     */
    constructor() {
        // Elementos do DOM
        this.gameContainer = document.getElementById('game-container');
        this.rocketElement = document.getElementById('rocket');
        this.flameElement = document.getElementById('flame');
        this.landingPad = document.getElementById('landing-pad');
        this.velocityDisplay = document.getElementById('velocity');
        this.fuelDisplay = document.getElementById('fuel');
        this.scoreDisplay = document.getElementById('score');
        this.playerNameDisplay = document.getElementById('player-name-display');
        this.landingCountDisplay = document.getElementById('landing-count');
        this.windStrengthDisplay = document.getElementById('wind-strength');
        this.windArrow = document.getElementById('wind-arrow');
        this.gameOverScreen = document.getElementById('game-over');
        this.messageDisplay = document.getElementById('message');
        this.endScoreDisplay = document.getElementById('end-score');
        this.restartBtn = document.getElementById('restart-btn');
        this.showLeaderboardBtn = document.getElementById('show-leaderboard-btn');
        this.loginScreen = document.getElementById('login-screen');
        this.usernameInput = document.getElementById('username-input');
        this.loginBtn = document.getElementById('login-btn');
        this.startScreen = document.getElementById('start-screen');
        this.startBtn = document.getElementById('start-btn');
        this.leaderboardBtn = document.getElementById('leaderboard-btn');
        this.levelCompleteScreen = document.getElementById('level-complete');
        this.levelPointsDisplay = document.getElementById('level-points');
        this.nextLevelBtn = document.getElementById('next-level-btn');
        this.leaderboardScreen = document.getElementById('leaderboard-screen');
        this.leaderboardTable = document.getElementById('leaderboard-body');
        this.closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
        this.refreshLeaderboardBtn = document.getElementById('refresh-leaderboard-btn');
        
        // Dimensões do contêiner
        this.containerWidth = this.gameContainer.clientWidth;
        this.containerHeight = this.gameContainer.clientHeight;
        
        // Estado do jogo
        this.gameRunning = false;
        this.score = 0;
        
        // Inicializa os sistemas
        this.initSystems();
        
        // Configura os eventos
        this.setupEvents();
        
        // Cria as estrelas de fundo
        Utils.createStars(this.gameContainer, 100);
        
        // Mostra a tela de login
        this.showLoginScreen();
    }
    
    /**
     * Inicializa os sistemas do jogo
     */
    initSystems() {
        // Sistema de partículas
        this.particleSystem = new ParticleSystem(this.gameContainer);
        
        // Foguete
        this.rocket = new Rocket(this.rocketElement, this.flameElement, this.particleSystem);
        
        // Gerenciador de níveis
        this.levelManager = new LevelManager(
            this.landingPad,
            this.levelCompleteScreen,
            this.levelPointsDisplay,
            this.nextLevelBtn
        );
        
        // Sistema de vento
        this.wind = new Wind(
            this.windStrengthDisplay,
            this.windArrow,
            this.particleSystem,
            this.levelManager.currentLevel
        );
        
        // Sistema de leaderboard
        this.leaderboard = new Leaderboard();
    }
    
    /**
     * Configura os eventos do jogo
     */
    setupEvents() {
        // Botão de login
        this.loginBtn.addEventListener('click', () => {
            this.handleLogin();
        });
        
        // Tecla Enter no campo de nome de usuário
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });
        
        // Botão de reiniciar
        this.restartBtn.addEventListener('click', () => {
            this.gameOverScreen.style.display = 'none';
            this.startGame();
        });
        
        // Botão de iniciar
        this.startBtn.addEventListener('click', () => {
            this.startScreen.style.display = 'none';
            this.startGame();
        });
        
        // Botão de mostrar leaderboard (na tela de game over)
        this.showLeaderboardBtn.addEventListener('click', () => {
            this.gameOverScreen.style.display = 'none';
            this.showLeaderboardScreen();
        });
        
        // Botão de mostrar leaderboard (na tela inicial)
        this.leaderboardBtn.addEventListener('click', () => {
            this.showLeaderboardScreen();
        });
        
        // Botão de fechar leaderboard
        this.closeLeaderboardBtn.addEventListener('click', () => {
            this.leaderboardScreen.style.display = 'none';
            
            // Se o jogo estiver em andamento, não mostra nenhuma tela
            if (!this.gameRunning) {
                // Verifica se o jogo acabou de terminar
                if (this.gameOverScreen.style.display === 'none' && 
                    this.levelCompleteScreen.style.display === 'none') {
                    this.startScreen.style.display = 'flex';
                }
            }
        });
        
        // Botão de atualizar leaderboard
        this.refreshLeaderboardBtn.addEventListener('click', () => {
            this.refreshLeaderboard();
        });
        
        // Evento de avanço de nível
        document.addEventListener('levelAdvance', () => {
            this.startGame();
        });
        
        // Evento de redimensionamento da janela
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    /**
     * Trata o login do usuário
     */
    handleLogin() {
        const username = this.usernameInput.value.trim();
        
        if (username) {
            // Define o jogador atual
            const player = this.leaderboard.setCurrentPlayer(username);
            
            // Atualiza o display do nome do jogador
            this.playerNameDisplay.textContent = player.name;
            this.landingCountDisplay.textContent = player.landingCount;
            
            // Esconde a tela de login
            this.loginScreen.style.display = 'none';
            
            // Mostra a tela inicial
            this.showStartScreen();
        } else {
            // Destaca o campo de entrada
            this.usernameInput.style.outline = '2px solid red';
            setTimeout(() => {
                this.usernameInput.style.outline = '';
            }, 1000);
        }
    }
    
    /**
     * Mostra a tela de login
     */
    showLoginScreen() {
        this.loginScreen.style.display = 'flex';
        this.usernameInput.focus();
    }
    
    /**
     * Mostra a tela de leaderboard
     */
    showLeaderboardScreen() {
        // Renderiza o leaderboard
        this.leaderboard.renderLeaderboard(this.leaderboardTable);
        
        // Mostra a tela
        this.leaderboardScreen.style.display = 'flex';
    }
    
    /**
     * Inicia o jogo
     */
    startGame() {
        // Atualiza as dimensões do contêiner
        this.containerWidth = this.gameContainer.clientWidth;
        this.containerHeight = this.gameContainer.clientHeight;
        
        // Configura o nível atual
        this.levelManager.setupLevel(this.containerWidth);
        
        // Configura o vento para o nível atual
        this.wind.setLevel(this.levelManager.currentLevel);
        
        // Reinicia o foguete
        this.rocket.reset(this.containerWidth, this.containerHeight);
        this.rocketElement.style.display = 'block';
        
        // Limpa as partículas
        this.particleSystem.clear();
        
        // Inicia o jogo
        this.gameRunning = true;
        
        // Inicia o loop do jogo
        this.gameLoop();
    }
    
    /**
     * Loop principal do jogo
     */
    gameLoop() {
        if (!this.gameRunning) return;
        
        // Atualiza o vento
        const windState = this.wind.tick();
        
        // Atualiza o foguete
        const rocketState = this.rocket.update(
            this.levelManager.gravity,
            windState.strength,
            windState.direction,
            this.containerWidth,
            this.containerHeight
        );
        
        // Atualiza as partículas
        this.particleSystem.update();
        
        // Atualiza o HUD
        this.updateHUD(rocketState);
        
        // Verifica colisão com o solo
        if (rocketState.y > this.containerHeight - 50) {
            this.handleLanding(rocketState);
            return;
        }
        
        // Continua o loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Atualiza o HUD (Heads-Up Display)
     * @param {Object} rocketState - Estado atual do foguete
     */
    updateHUD(rocketState) {
        this.velocityDisplay.textContent = Utils.formatNumber(rocketState.velocityY);
        this.fuelDisplay.textContent = Math.floor(rocketState.fuel);
        this.scoreDisplay.textContent = this.score;
        this.landingCountDisplay.textContent = this.leaderboard.currentPlayer.landingCount;
    }
    
    /**
     * Trata o pouso do foguete
     * @param {Object} rocketState - Estado atual do foguete
     */
    handleLanding(rocketState) {
        this.gameRunning = false;
        
        // Verifica se o foguete está sobre a plataforma
        if (this.levelManager.isOverPad(rocketState)) {
            // Verifica se o pouso foi bem-sucedido
            if (rocketState.velocityY < CONFIG.LANDING.MAX_LANDING_VELOCITY && 
                Math.abs(rocketState.angle) < CONFIG.LANDING.MAX_LANDING_ANGLE) {
                
                // Calcula a pontuação do pouso
                let landingScore = 0;
                
                // Pouso perfeito (velocidade muito baixa e ângulo próximo de zero)
                if (rocketState.velocityY < CONFIG.LANDING.MAX_LANDING_VELOCITY / 2 && 
                    Math.abs(rocketState.angle) < CONFIG.LANDING.MAX_LANDING_ANGLE / 2) {
                    landingScore = CONFIG.SCORE.PERFECT_LANDING;
                    this.showLevelComplete("Pouso perfeito! Incrível!", landingScore);
                } else {
                    // Pouso bom
                    landingScore = CONFIG.SCORE.GOOD_LANDING;
                    this.showLevelComplete("Pouso bem-sucedido!", landingScore);
                }
                
                // Adiciona bônus de combustível
                const fuelBonus = Math.floor(rocketState.fuel * CONFIG.SCORE.FUEL_BONUS_MULTIPLIER);
                landingScore += fuelBonus;
                
                // Atualiza a pontuação total
                this.score += landingScore;
                
                // Atualiza o leaderboard
                this.leaderboard.updatePlayerScore(landingScore, true);
                
                // Mostra a tela de nível completo
                this.levelManager.showLevelComplete(landingScore);
            } else {
                // Pouso com muita velocidade ou ângulo incorreto
                this.rocket.explode();
                this.gameOver("Pouso falhou! Muita velocidade ou ângulo incorreto.");
                
                // Atualiza o leaderboard (sem incrementar o contador de pousos)
                this.leaderboard.updatePlayerScore(0, false);
            }
        } else {
            // Colisão com o solo
            this.rocket.explode();
            this.gameOver("Colisão! Você perdeu o foguete.");
            
            // Atualiza o leaderboard (sem incrementar o contador de pousos)
            this.leaderboard.updatePlayerScore(0, false);
        }
    }
    
    /**
     * Mostra a mensagem de game over
     * @param {string} message - Mensagem a ser exibida
     */
    gameOver(message) {
        this.messageDisplay.textContent = message;
        this.endScoreDisplay.textContent = this.score;
        this.gameOverScreen.style.display = 'block';
    }
    
    /**
     * Mostra a mensagem de nível completo
     * @param {string} message - Mensagem a ser exibida
     * @param {number} levelScore - Pontuação do nível
     */
    showLevelComplete(message, levelScore) {
        this.messageDisplay.textContent = message;
        this.levelPointsDisplay.textContent = levelScore;
    }
    
    /**
     * Mostra a tela inicial
     */
    showStartScreen() {
        this.startScreen.style.display = 'flex';
    }
    
    /**
     * Trata o redimensionamento da janela
     */
    handleResize() {
        this.containerWidth = this.gameContainer.clientWidth;
        this.containerHeight = this.gameContainer.clientHeight;
        
        // Reposiciona a plataforma de pouso
        this.levelManager.setupLevel(this.containerWidth);
        
        // Ajusta a posição do foguete se estiver fora dos limites
        if (this.rocket.x > this.containerWidth - 20) {
            this.rocket.x = this.containerWidth - 20;
            this.rocket.updatePosition();
        }
    }
    
    /**
     * Atualiza o leaderboard a partir do Firebase
     */
    async refreshLeaderboard() {
        // Verifica se o botão já está em estado de carregamento
        if (this.refreshLeaderboardBtn.classList.contains('loading')) {
            return;
        }
        
        // Define o botão como carregando
        this.refreshLeaderboardBtn.classList.add('loading');
        this.refreshLeaderboardBtn.textContent = 'Atualizando...';
        
        try {
            // Tenta atualizar o leaderboard
            const updated = await this.leaderboard.refreshOnlineLeaderboard();
            
            // Renderiza o leaderboard atualizado
            this.leaderboard.renderLeaderboard(this.leaderboardTable);
            
            // Exibe mensagem de sucesso ou falha
            if (updated) {
                this.refreshLeaderboardBtn.textContent = 'Atualizado!';
                setTimeout(() => {
                    this.refreshLeaderboardBtn.textContent = 'Atualizar Placar';
                    this.refreshLeaderboardBtn.classList.remove('loading');
                }, 1500);
            } else {
                this.refreshLeaderboardBtn.textContent = 'Falha ao Atualizar';
                setTimeout(() => {
                    this.refreshLeaderboardBtn.textContent = 'Atualizar Placar';
                    this.refreshLeaderboardBtn.classList.remove('loading');
                }, 1500);
            }
        } catch (error) {
            console.error('Erro ao atualizar leaderboard:', error);
            this.refreshLeaderboardBtn.textContent = 'Erro ao Atualizar';
            setTimeout(() => {
                this.refreshLeaderboardBtn.textContent = 'Atualizar Placar';
                this.refreshLeaderboardBtn.classList.remove('loading');
            }, 1500);
        }
    }
} 