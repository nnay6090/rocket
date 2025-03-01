/**
 * Arquivo principal que inicializa o jogo
 */

// Espera o DOM ser carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o jogo
    const game = new Game();
    
    // Exibe mensagem de boas-vindas no console
    console.log('Jogo de Pouso de Foguete iniciado!');
    console.log('Controles:');
    console.log('↑ ou W: Propulsão');
    console.log('← ou A: Rotacionar para esquerda');
    console.log('→ ou D: Rotacionar para direita');
}); 