# Pouso Lunar - Jogo de Pouso de Foguete

Um jogo de navegador onde você controla um foguete e tenta pousar com segurança em uma plataforma, enfrentando ventos e gravidade.

![Pouso Lunar](screenshot.png)

## Sobre o Jogo

Pouso Lunar é um jogo inspirado nos clássicos jogos de pouso lunar, onde o jogador deve controlar um foguete e pousá-lo com segurança em uma plataforma. O jogo apresenta:

- Física realista com gravidade e ventos
- Sistema de partículas para efeitos visuais
- Múltiplos níveis com dificuldade crescente
- Sistema de pontuação baseado na qualidade do pouso e combustível restante

## Como Jogar

1. Use as teclas de seta para cima (↑) ou W para ativar a propulsão
2. Use as teclas de seta para esquerda (←) ou A para rotacionar o foguete para a esquerda
3. Use as teclas de seta para direita (→) ou D para rotacionar o foguete para a direita
4. Pouse suavemente na plataforma com uma velocidade baixa e um ângulo próximo de zero

## Requisitos para um Pouso Bem-Sucedido

- Velocidade vertical menor que 2 m/s
- Ângulo do foguete menor que 15 graus
- O foguete deve estar sobre a plataforma de pouso

## Níveis

O jogo possui 5 níveis com dificuldade crescente:

- A cada nível, a gravidade aumenta
- A força do vento se torna mais intensa
- A plataforma de pouso fica mais estreita

## Pontuação

- Pouso perfeito: 1000 pontos
- Pouso bom: 500 pontos
- Bônus de combustível: 10 pontos por unidade de combustível restante

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Programação Orientada a Objetos

## Estrutura do Projeto

```
pouso-lunar/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── utils.js
│   ├── particles.js
│   ├── rocket.js
│   ├── wind.js
│   ├── levels.js
│   ├── game.js
│   └── main.js
└── assets/
    ├── images/
    └── sounds/
```

## Como Executar

Basta abrir o arquivo `index.html` em um navegador moderno.

## Compatibilidade

O jogo é compatível com os seguintes navegadores:
- Google Chrome (recomendado)
- Mozilla Firefox
- Microsoft Edge
- Safari

## Desenvolvimento Futuro

Ideias para futuras atualizações:
- Adicionar efeitos sonoros
- Implementar obstáculos móveis
- Adicionar diferentes tipos de foguetes
- Criar um modo multijogador
- Adicionar suporte para dispositivos móveis com controles de toque

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Autor

Desenvolvido como um projeto de demonstração para aprendizado de desenvolvimento de jogos com JavaScript. 