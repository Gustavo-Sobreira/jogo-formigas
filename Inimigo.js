class Inimigo {
    constructor({ stage, image, velocidade, ataque, totalInimigos }) {
        this.stage = stage;
        this.sprite = new createjs.Bitmap(image);
        this.velocidade = velocidade + Math.random() * 0.3;
        this.ataque = ataque;
        this.colidindoComFormigueiro = false;
        this.totalInimigos = totalInimigos;
        this.anguloAtual = Math.random() * 2 * Math.PI; // Ângulo inicial aleatório para movimento circular
        this.direcaoAleatoria = Math.random() * 2 * Math.PI; // Direção inicial aleatória para movimento aleatório

        // Define manualmente os bounds com base no tamanho da imagem
        const bounds = { x: 0, y: 0, width: 24, height: 24 };
        this.sprite.getBounds = () => bounds;

        // Posiciona o inimigo aleatoriamente
        this.sprite.x = Math.random() * stage.canvas.width;
        this.sprite.y = Math.random() * stage.canvas.height;

        stage.addChild(this.sprite);
    }

    update(formiga, formigueiro, folhas) {
        if (!formiga || !formigueiro) {
            console.error("Formiga ou formigueiro não inicializado corretamente.");
            return;
        }

        // Escolhe a folha mais próxima, se houver folhas disponíveis
        let folhaMaisProxima = null;
        let menorDistancia = Infinity;

        if (folhas && folhas.length > 0) {
            folhas.forEach((folha) => {
                const dx = folha.sprite.x - this.sprite.x;
                const dy = folha.sprite.y - this.sprite.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    folhaMaisProxima = folha;
                }
            });
        }

        this.verificarColisaoComFormigueiro(formigueiro);
        this.definirMovimentacao(folhaMaisProxima, formiga, formigueiro);
    }

    verificarColisaoComFormigueiro(formigueiro) {
        const dx = this.sprite.x - formigueiro.posX;
        const dy = this.sprite.y - formigueiro.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const colidiu = dist <= formigueiro.radius;

        if (colidiu) {
            this.colidindoComFormigueiro = true;
        } else {
            this.colidindoComFormigueiro = false;
        }
    }

    definirMovimentacao(folha, formiga, formigueiro) {
        const difFormigaX = formiga.sprite.x - this.sprite.x;
        const difFormigaY = formiga.sprite.y - this.sprite.y;
        const distFormiga = Math.sqrt(difFormigaX * difFormigaX + difFormigaY * difFormigaY);

        let distFolha = Infinity;
        if (folha) {
            const difFolhaX = folha.sprite.x - this.sprite.x;
            const difFolhaY = folha.sprite.y - this.sprite.y;
            distFolha = Math.sqrt(difFolhaX * difFolhaX + difFolhaY * difFolhaY);
        }

        if (this.colidindoComFormigueiro) {
            this.rondarFormigueiro(formigueiro);
        } else if (distFormiga < 300) {
            this.calcularDirecaoMovimentoDirecionadoAFormiga(formiga);
        } else if (folha && distFolha < 400) {
            this.calcularDirecaoMovimentoDirecionadoAFolha(folha);
        } else {
            this.calcularDirecaoMovimentoAleatorio();
        }
    }

    rondarFormigueiro(formigueiro) {
        const raio = formigueiro.radius + 15; // Raio da órbita
        const velocidadeAngular = 0.06 + (Math.random() * 0.04); // Velocidade de rotação (radianos por frame)

        // Incrementa o ângulo para criar o movimento circular
        this.anguloAtual += velocidadeAngular;

        // Calcula a nova posição com base no ângulo
        this.sprite.x = formigueiro.posX + Math.cos(this.anguloAtual) * raio;
        this.sprite.y = formigueiro.posY + Math.sin(this.anguloAtual) * raio;

        // Libera a colisão após completar o movimento
        this.colidindoComFormigueiro = false;
    }

    calcularDirecaoMovimentoAleatorio() {
        // Definindo uma taxa para o inimigo mudar sua direção
        const intervaloMudancaDirecao = 50; // A cada 50 frames o inimigo mudará sua direção
        if (Math.random() < 0.05) {
            this.direcaoAleatoria += (Math.random() - 0.5) * 0.2; // Pequena mudança na direção
        }else if (Math.random() > 0.05) {
            this.direcaoAleatoria += (Math.random() - 0.5) * 0.2; // Pequena mudança na direção
        }
    
        // Movimento suave, com curvaturas
        const dx = Math.cos(this.direcaoAleatoria);
        const dy = Math.sin(this.direcaoAleatoria);
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.movimentar(dx, dy, dist, (this.velocidade * 0.1));

        // Garantir que o inimigo fique dentro dos limites da tela (se necessário)
        const canvasWidth = this.stage.canvas.width;
        const canvasHeight = this.stage.canvas.height;
        
        if (this.sprite.x < 0) this.sprite.x = 0;
        if (this.sprite.x > canvasWidth) this.sprite.x = canvasWidth;
        if (this.sprite.y < 0) this.sprite.y = 0;
        if (this.sprite.y > canvasHeight) this.sprite.y = canvasHeight;

    }
    

    calcularDirecaoMovimentoDirecionadoAFormiga(formiga) {
        const dx = formiga.sprite.x - this.sprite.x;
        const dy = formiga.sprite.y - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const velocidade = this.velocidade * 1;
        this.movimentar(dx, dy, dist, velocidade);
    }

    calcularDirecaoMovimentoDirecionadoAFolha(folha) {
        const dx = folha.sprite.x - this.sprite.x;
        const dy = folha.sprite.y - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const velocidade = this.velocidade * 0.5;
        this.movimentar(dx, dy, dist, velocidade);
    }

    movimentar(dx, dy, dist, velocidade) {
        if (dist > 0) {
            this.sprite.x += (dx / dist) * velocidade;
            this.sprite.y += (dy / dist) * velocidade;
        }
    }
}
