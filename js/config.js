/**
 * Configurações do Jogo de Pouso de Foguete
 */

const CONFIG = {
    // Configurações gerais
    FPS: 60,
    GRAVITY: 0.05,
    THRUST: 0.1,
    
    // Configurações do foguete
    ROCKET: {
        WIDTH: 20,
        HEIGHT: 40,
        MAX_ANGLE: 45,  // Ângulo máximo de rotação (em graus)
        ROTATION_SPEED: 5,  // Velocidade de rotação (em graus)
        FUEL_CONSUMPTION: 0.1,  // Taxa de consumo de combustível
        INITIAL_FUEL: 100,  // Combustível inicial
    },
    
    // Configurações do vento
    WIND: {
        MAX_STRENGTH: 0.03,  // Força máxima do vento
        CHANGE_INTERVAL: 300,  // Intervalo para mudança do vento (em frames)
        PARTICLE_CHANCE: 0.3,  // Chance de criar partículas de vento
        PARTICLE_SPEED_MULTIPLIER: 1000,  // Multiplicador de velocidade das partículas
    },
    
    // Configurações de pouso
    LANDING: {
        MAX_LANDING_VELOCITY: 2,  // Velocidade máxima para pouso seguro
        MAX_LANDING_ANGLE: 15,  // Ângulo máximo para pouso seguro (em graus)
    },
    
    // Configurações de pontuação
    SCORE: {
        PERFECT_LANDING: 1000,  // Pontuação para pouso perfeito
        GOOD_LANDING: 500,  // Pontuação para pouso bom
        FUEL_BONUS_MULTIPLIER: 10,  // Multiplicador de bônus de combustível
    },
    
    // Níveis do jogo
    LEVELS: {
        COUNT: 5,  // Número total de níveis
        WIND_INCREASE_PER_LEVEL: 0.005,  // Aumento da força do vento por nível
        GRAVITY_INCREASE_PER_LEVEL: 0.01,  // Aumento da gravidade por nível
        PAD_WIDTH_DECREASE_PER_LEVEL: 10,  // Diminuição da largura da plataforma por nível
    }
}; 