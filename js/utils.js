/**
 * Funções utilitárias para o jogo
 */

const Utils = {
    /**
     * Gera um número aleatório entre min e max
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} - Número aleatório
     */
    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * Limita um valor entre min e max
     * @param {number} value - Valor a ser limitado
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} - Valor limitado
     */
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Verifica se dois objetos estão colidindo (colisão simples de retângulos)
     * @param {Object} obj1 - Primeiro objeto com propriedades x, y, width, height
     * @param {Object} obj2 - Segundo objeto com propriedades x, y, width, height
     * @returns {boolean} - Verdadeiro se estiverem colidindo
     */
    checkCollision: function(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    },
    
    /**
     * Converte graus para radianos
     * @param {number} degrees - Ângulo em graus
     * @returns {number} - Ângulo em radianos
     */
    degreesToRadians: function(degrees) {
        return degrees * Math.PI / 180;
    },
    
    /**
     * Converte radianos para graus
     * @param {number} radians - Ângulo em radianos
     * @returns {number} - Ângulo em graus
     */
    radiansToDegrees: function(radians) {
        return radians * 180 / Math.PI;
    },
    
    /**
     * Calcula a distância entre dois pontos
     * @param {number} x1 - Coordenada X do primeiro ponto
     * @param {number} y1 - Coordenada Y do primeiro ponto
     * @param {number} x2 - Coordenada X do segundo ponto
     * @param {number} y2 - Coordenada Y do segundo ponto
     * @returns {number} - Distância entre os pontos
     */
    distance: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    /**
     * Formata um número com duas casas decimais
     * @param {number} num - Número a ser formatado
     * @returns {string} - Número formatado
     */
    formatNumber: function(num) {
        return num.toFixed(2);
    },
    
    /**
     * Cria um elemento de estrela para o fundo
     * @param {HTMLElement} container - Elemento contêiner
     * @param {number} containerWidth - Largura do contêiner
     * @param {number} containerHeight - Altura do contêiner
     */
    createStar: function(container, containerWidth, containerHeight) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = this.random(0, containerWidth) + 'px';
        star.style.top = this.random(0, containerHeight) + 'px';
        star.style.opacity = this.random(0.2, 0.8);
        
        // Algumas estrelas são maiores
        if (Math.random() > 0.9) {
            star.style.width = '3px';
            star.style.height = '3px';
        }
        
        container.appendChild(star);
        return star;
    },
    
    /**
     * Cria várias estrelas para o fundo
     * @param {HTMLElement} container - Elemento contêiner
     * @param {number} count - Quantidade de estrelas
     */
    createStars: function(container, count) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        for (let i = 0; i < count; i++) {
            this.createStar(container, containerWidth, containerHeight);
        }
    }
}; 