/**
 * Classe para gerenciar o leaderboard do jogo
 */
class Leaderboard {
    /**
     * Inicializa o leaderboard
     */
    constructor() {
        // Dados do leaderboard
        this.players = [];
        
        // Jogador atual
        this.currentPlayer = null;
        
        // Flag para indicar se estamos online
        this.isOnline = this.checkOnlineStatus();
        
        // Carrega os dados do leaderboard
        this.loadLeaderboard();
    }
    
    /**
     * Verifica se o Firebase está disponível
     */
    checkOnlineStatus() {
        return typeof firebase !== 'undefined' && firebase.app() !== null;
    }
    
    /**
     * Carrega os dados do leaderboard do localStorage e/ou Firebase
     */
    async loadLeaderboard() {
        // Primeiro carrega do localStorage (para ter dados imediatos)
        this.loadFromLocalStorage();
        
        // Se estiver online, tenta carregar do Firebase
        if (this.isOnline) {
            try {
                const onlinePlayers = await getOnlineLeaderboard();
                
                if (onlinePlayers && onlinePlayers.length > 0) {
                    // Mescla os dados online com os dados locais
                    this.mergePlayers(onlinePlayers);
                }
            } catch (error) {
                console.error('Erro ao carregar leaderboard online:', error);
            }
        }
    }
    
    /**
     * Carrega os dados do localStorage
     */
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('rocketLeaderboard');
            if (savedData) {
                this.players = JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Erro ao carregar o leaderboard local:', error);
            this.players = [];
        }
    }
    
    /**
     * Mescla jogadores online com jogadores locais
     */
    mergePlayers(onlinePlayers) {
        // Cria um mapa dos jogadores locais por nome
        const localPlayerMap = {};
        this.players.forEach(player => {
            localPlayerMap[player.name.toLowerCase()] = player;
        });
        
        // Mescla os jogadores online
        onlinePlayers.forEach(onlinePlayer => {
            const localPlayer = localPlayerMap[onlinePlayer.name.toLowerCase()];
            
            if (localPlayer) {
                // Atualiza o jogador local se o online tiver pontuação maior
                if (onlinePlayer.score > localPlayer.score) {
                    localPlayer.score = onlinePlayer.score;
                    localPlayer.landingCount = onlinePlayer.landingCount;
                }
            } else {
                // Adiciona o jogador online à lista local
                this.players.push(onlinePlayer);
            }
        });
        
        // Atualiza o jogador atual se necessário
        if (this.currentPlayer) {
            const onlineCurrentPlayer = onlinePlayers.find(
                p => p.name.toLowerCase() === this.currentPlayer.name.toLowerCase()
            );
            
            if (onlineCurrentPlayer && onlineCurrentPlayer.score > this.currentPlayer.score) {
                this.currentPlayer.score = onlineCurrentPlayer.score;
                this.currentPlayer.landingCount = onlineCurrentPlayer.landingCount;
            }
        }
        
        // Ordena os jogadores
        this.players.sort((a, b) => b.score - a.score);
        
        // Salva no localStorage
        this.saveToLocalStorage();
    }
    
    /**
     * Salva os dados do leaderboard no localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('rocketLeaderboard', JSON.stringify(this.players));
        } catch (error) {
            console.error('Erro ao salvar o leaderboard local:', error);
        }
    }
    
    /**
     * Define o jogador atual
     * @param {string} name - Nome do jogador
     * @returns {Object} - Dados do jogador
     */
    async setCurrentPlayer(name) {
        // Verifica se o jogador já existe localmente
        let player = this.players.find(p => p.name.toLowerCase() === name.toLowerCase());
        
        // Se não existir, cria um novo jogador
        if (!player) {
            player = {
                name: name,
                score: 0,
                landingCount: 0,
                lastPlayed: new Date().toISOString()
            };
            this.players.push(player);
        } else {
            // Atualiza a data de último jogo
            player.lastPlayed = new Date().toISOString();
        }
        
        // Define o jogador atual
        this.currentPlayer = player;
        
        // Salva no localStorage
        this.saveToLocalStorage();
        
        // Se estiver online, verifica se o jogador existe no Firebase
        if (this.isOnline) {
            try {
                await updatePlayerOnline(player);
            } catch (error) {
                console.error('Erro ao sincronizar jogador com o Firebase:', error);
            }
        }
        
        return player;
    }
    
    /**
     * Atualiza a pontuação do jogador atual
     * @param {number} points - Pontos a adicionar
     * @param {boolean} successfulLanding - Se o pouso foi bem-sucedido
     */
    async updatePlayerScore(points, successfulLanding) {
        if (!this.currentPlayer) return;
        
        // Adiciona os pontos
        this.currentPlayer.score += points;
        
        // Incrementa o contador de pousos bem-sucedidos
        if (successfulLanding) {
            this.currentPlayer.landingCount++;
        }
        
        // Atualiza a data de último jogo
        this.currentPlayer.lastPlayed = new Date().toISOString();
        
        // Ordena o leaderboard por pontuação
        this.players.sort((a, b) => b.score - a.score);
        
        // Salva no localStorage
        this.saveToLocalStorage();
        
        // Se estiver online, atualiza no Firebase
        if (this.isOnline) {
            try {
                await updatePlayerOnline(this.currentPlayer);
                
                // Recarrega o leaderboard para ter os dados mais atualizados
                const onlinePlayers = await getOnlineLeaderboard();
                if (onlinePlayers && onlinePlayers.length > 0) {
                    this.mergePlayers(onlinePlayers);
                }
            } catch (error) {
                console.error('Erro ao atualizar pontuação online:', error);
            }
        }
    }
    
    /**
     * Obtém os dados do leaderboard
     * @param {number} limit - Limite de jogadores a retornar
     * @returns {Array} - Dados do leaderboard
     */
    getLeaderboard(limit = 10) {
        // Retorna uma cópia dos dados do leaderboard
        return this.players.slice(0, limit);
    }
    
    /**
     * Obtém a posição do jogador atual no leaderboard
     * @returns {number} - Posição do jogador (1-indexed)
     */
    getCurrentPlayerRank() {
        if (!this.currentPlayer) return 0;
        
        // Encontra a posição do jogador atual
        const index = this.players.findIndex(p => p.name === this.currentPlayer.name);
        
        // Retorna a posição (1-indexed)
        return index >= 0 ? index + 1 : 0;
    }
    
    /**
     * Renderiza o leaderboard na tabela HTML
     * @param {HTMLElement} tableBody - Elemento tbody da tabela
     */
    renderLeaderboard(tableBody) {
        // Limpa a tabela
        tableBody.innerHTML = '';
        
        // Se não houver jogadores, exibe uma mensagem
        if (this.players.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'Nenhum jogador registrado ainda.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }
        
        // Adiciona cada jogador à tabela
        this.players.forEach((player, index) => {
            const row = document.createElement('tr');
            
            // Destaca o jogador atual
            if (this.currentPlayer && player.name === this.currentPlayer.name) {
                row.classList.add('current-player');
            }
            
            // Posição
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);
            
            // Nome
            const nameCell = document.createElement('td');
            nameCell.textContent = player.name;
            row.appendChild(nameCell);
            
            // Pontuação
            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.score;
            row.appendChild(scoreCell);
            
            // Pousos bem-sucedidos
            const landingsCell = document.createElement('td');
            landingsCell.textContent = player.landingCount;
            row.appendChild(landingsCell);
            
            // Adiciona a linha à tabela
            tableBody.appendChild(row);
        });
    }
    
    /**
     * Atualiza o leaderboard a partir do Firebase
     */
    async refreshOnlineLeaderboard() {
        if (this.isOnline) {
            try {
                const onlinePlayers = await getOnlineLeaderboard();
                if (onlinePlayers && onlinePlayers.length > 0) {
                    this.mergePlayers(onlinePlayers);
                    return true;
                }
            } catch (error) {
                console.error('Erro ao atualizar leaderboard online:', error);
            }
        }
        return false;
    }
    
    /**
     * Limpa todos os dados do leaderboard local
     * Útil para desenvolvimento/testes
     */
    clearLeaderboard() {
        this.players = [];
        this.currentPlayer = null;
        localStorage.removeItem('rocketLeaderboard');
    }
} 