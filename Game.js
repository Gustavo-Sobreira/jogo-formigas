class Game {
    constructor(stage, queue) {
        this.stage = stage;
        this.queue = queue;
        this.pontos = 0;
        this.folhasDisponiveis = 0;
        this.teclas = {};
        this.tempoDecorrido = 0;
        this.intervaloAumentoInimigos = 10; 
        this.ultimoSpawn = 0;
        this.ultimoRegen = 0; // Adiciona um temporizador para regeneração de vida
        this.totalCompras = 1;

        this.posX = 200;
        this.posY = 300;
        this.totalInimigos = 1;
        this.maxInimigos = 5; // Define o número máximo de inimigos inicial como Fácil
        this.inimigosCriados = 0; // Contador para o número de inimigos criados
        this.velocidadeAdicionadaInimigos = 0; // Velocidade adicionada aos inimigos

        // Inicializa a formiga
        this.formiga = new Formiga({
            stage: stage,
            image: queue.getResult("formiga"),
            posX: this.posX,
            posY: this.posY,
            vida: 20,
            velocidade: 1.5,
        });
        
        this.atualizarVidaNaTela(); // Atualiza a vida no início do jogo
        this.atualizarVelocidadeFormigaNaTela(); // Atualiza a velocidade da formiga no início do jogo
        this.atualizarVelocidadeInimigosNaTela(); // Atualiza a velocidade dos inimigos no início do jogo

        // Inicializa o formigueiro
        this.formigueiro = new Formigueiro({
            stage: stage,
            image: queue.getResult("formigueiro"),
            posX: this.posX,
            posY: this.posY,
            radius: queue.getResult("formigueiro").width / 2,
        });

        // Inicializa as folhas
        this.folhas = [new Folha(stage, queue.getResult("folha"))];
        
        if (this.folhasDisponiveis === 0) {
            this.criarNovaFolha();
        }
    
        // Inicializa os inimigos
        this.inimigos = [];
        this.spawnInimigos(this.totalInimigos);

        // Adiciona event listeners para os botões de compra
        document.getElementById("vida").addEventListener("click", () => this.comprarVida());
        document.getElementById("velocidade").addEventListener("click", () => this.comprarVelocidade());
        // document.getElementById("casa").addEventListener("click", () => this.comprarCasa());

        // Adiciona event listeners para as teclas de controle
        window.addEventListener("keydown", (e) => {
            this.teclas[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.teclas[e.key] = false;
        });
        
        this.gameOverFlag = false; // Flag para indicar se o jogo acabou
    }

    // Função para definir a dificuldade do jogo
    setDifficulty(difficulty) {
        if (difficulty === "easy") {
            this.maxInimigos = 5;
        } else if (difficulty === "medium") {
            this.maxInimigos = 10;
        } else if (difficulty === "survival") {
            this.maxInimigos = 100;
        }
    }

    // Função para comprar vida
    comprarVida() {
        if (this.pontos >= this.totalCompras) {
            this.formiga.upVida();
            this.pontos -= this.totalCompras;
            this.totalCompras++;
            document.getElementById("pontos").innerText = this.pontos;
        } else {
            alert("Pontos insuficientes!");
        }
    }

    // Função para atualizar a vida na tela
    atualizarVidaNaTela() {
        const vidaElement = document.getElementById("vidaValue");
        if (vidaElement) {
            this.formiga.vida = Math.min(this.formiga.vida, 100); // Limita vida máxima
            vidaElement.innerText = this.formiga.vida;
        }
    }
    

    // Função para atualizar a velocidade da formiga na tela
    atualizarVelocidadeFormigaNaTela() {
        const velocidadeFormigaElement = document.getElementById("velocidadeFormiga");
        if (velocidadeFormigaElement) {
            velocidadeFormigaElement.innerText = this.formiga.velocidade;
        }
    }

    // Função para atualizar a velocidade dos inimigos na tela
    atualizarVelocidadeInimigosNaTela() {
        const velocidadeInimigosElement = document.getElementById("velocidadeInimigos");
        if (velocidadeInimigosElement) {
            velocidadeInimigosElement.innerText = this.velocidadeAdicionadaInimigos;
        }
    }

    // Função para aumentar a vida da formiga
    upVida() {
        this.formiga.vida += 10; // Aumenta a vida em 10, por exemplo
        if (this.formiga.vida > 100) {
            this.formiga.vida = 100; // Limita a vida máxima a 100
        }
        this.atualizarVidaNaTela(); // Atualiza a tela sempre que a vida mudar
    }

    // Função para aumentar a velocidade da formiga
    comprarVelocidade() {
        if (this.pontos >= this.totalCompras) {
            this.formiga.upVelocidade();
            this.pontos -= this.totalCompras;
            this.totalCompras++;
            document.getElementById("pontos").innerText = this.pontos;
            this.atualizarVelocidadeFormigaNaTela(); // Atualiza a velocidade da formiga na tela
        } else {
            alert("Pontos insuficientes!");
        }
    }

    // Função para comprar um novo formigueiro
    comprarCasa() {
        if (this.pontos >= this.totalCompras) { // Ajuste a quantidade de pontos necessária
            this.formigueiro.radius += 5; // Aumenta o raio
            this.pontos -= this.totalCompras; // Deduz 2 pontos para comprar a melhoria
            this.totalCompras++; // Aumenta o custo da próxima compra
            document.getElementById("pontos").innerText = this.pontos;
        } else {
            alert("Você não tem pontos suficientes!");
        }
    }

    // Função para criar um novo formigueiro em uma posição aleatória
    criarFormigueiroAleatorio() {
        const randomX = Math.random() * 800;
        const randomY = Math.random() * 600;
   
        const novoFormigueiro = new Formigueiro({
            stage: this.stage,
            image: this.queue.getResult("formigueiro"),
            posX: randomX,
            posY: randomY,
            radius: this.queue.getResult("formigueiro").width / 2,
        });
   
        this.stage.addChild(novoFormigueiro.sprite); // Adiciona o novo formigueiro ao estágio
        this.stage.update();
    }

    // Função para verificar a interação do formigueiro com as folhas
    formigueiroInterageComFolhas(formigueiro) {
        this.folhas.forEach((folha) => {
            if (this.checkCollision(formigueiro.sprite, folha.sprite)) {
                this.stage.removeChild(folha.sprite);
                this.folhas.splice(this.folhas.indexOf(folha), 1);
                this.folhasDisponiveis--;
                this.pontos++;
                document.getElementById("pontos").innerText = this.pontos;
            }
        });
    }

    // Função para iniciar o jogo
    start() {
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
    }

    // Função para criar novos inimigos
    spawnInimigos(count) {
        for (let i = 0; i < count; i++) {
            if (this.inimigos.length < this.maxInimigos) {
                const inimigo = new Inimigo({
                    stage: this.stage,
                    image: this.queue.getResult("inimigo"),
                    velocidade: 1 + this.velocidadeAdicionadaInimigos, // Adiciona a velocidade extra
                    ataque: 1,
                    totalInimigos: this.totalInimigos,
                });
                this.inimigos.push(inimigo);
                this.inimigosCriados++;

                // Aumenta a velocidade dos inimigos a cada 5 inimigos criados
                if (this.inimigosCriados % 5 === 0) {
                    this.aumentarVelocidadeInimigos();
                }
            }
        }
    }

    // Função para aumentar a velocidade dos inimigos
    aumentarVelocidadeInimigos() {
        this.velocidadeAdicionadaInimigos += 0.1;
        this.inimigos.forEach((inimigo) => {
            inimigo.velocidade += 0.1;
        });
        this.atualizarVelocidadeInimigosNaTela(); // Atualiza a velocidade dos inimigos na tela
    }

    // Função para criar uma nova folha
    criarNovaFolha() {
        const novaFolha = new Folha(this.stage, this.queue.getResult("folha"));
        this.folhas.push(novaFolha);
    }

    // Função de atualização do jogo, chamada a cada frame
    update(event) {
        if (this.gameOverFlag) return; // Se o jogo acabou, não atualiza mais

        this.tempoDecorrido += event.delta / 1000;

        // Verifica se é hora de aumentar o número de inimigos
        if (this.tempoDecorrido - this.ultimoSpawn >= this.intervaloAumentoInimigos) {
            this.spawnInimigos(1);
            this.ultimoSpawn = this.tempoDecorrido;
        }

        // Regenera a vida da formiga a cada 10 segundos
        if (this.tempoDecorrido - this.ultimoRegen >= 10) {
            this.formiga.vida += 1; // Aumenta a vida da formiga em 1
            if (this.formiga.vida > 100) {
                this.formiga.vida = 100; // Limita a vida máxima a 100
            }
            this.atualizarVidaNaTela(); // Atualiza a vida na tela após a regeneração
            this.ultimoRegen = this.tempoDecorrido; // Atualiza o tempo do último regen
        }

        // Atualiza a posição da formiga com base nas teclas pressionadas
        this.formiga.update(this.teclas);

        // Atualiza a posição dos inimigos
        this.inimigos.forEach((inimigo) => {
            inimigo.update(this.formiga, this.formigueiro, this.folhas);
        });

        // Verifica se a formiga colidiu com alguma folha
        this.folhas.forEach((folha, index) => {
            if (!this.formiga.carregandoFolha && this.checkCollision(this.formiga.sprite, folha.sprite)) {
                this.formiga.carregandoFolha = true;
                this.stage.removeChild(folha.sprite);
                this.folhas.splice(index, 1);
                this.formiga.sprite.image = this.queue.getResult("formiga-folha");
            }
        });

        // Verifica se a formiga está carregando uma folha e colidiu com o formigueiro
        if (this.formiga.carregandoFolha && this.checkCollision(this.formiga.sprite, this.formigueiro.sprite)) {
            this.formiga.carregandoFolha = false;
            this.pontos++;
            document.getElementById("pontos").innerText = this.pontos;
            this.formiga.sprite.image = this.queue.getResult("formiga");

            // Verifique se deve criar uma nova folha
            if (this.folhas.length === 0) {
                this.criarNovaFolha();
            }
        }

        // Verifica se a formiga colidiu com algum inimigo e perde vida
        this.inimigos.forEach((inimigo) => {
            if (this.checkCollision(this.formiga.sprite, inimigo.sprite)) {
                this.formiga.vida -= inimigo.ataque; // Diminui vida da formiga com base no ataque do inimigo
                this.atualizarVidaNaTela(); // Atualiza a vida na tela após a colisão
                if (this.formiga.vida <= 0) {
                    this.gameOver();
                }
            }
        });

        this.stage.update(event);
    }

    // Função para verificar colisão entre dois objetos
    checkCollision(obj1, obj2) {
        if (!obj1 || !obj2) return false;
        const bounds1 = obj1.getBounds();
        const bounds2 = obj2.getBounds();
        if (!bounds1 || !bounds2) return false; // Protege contra objetos sem bounds
        
        return (
            obj1.x < obj2.x + bounds2.width &&
            obj1.x + bounds1.width > obj2.x &&
            obj1.y < obj2.y + bounds2.height &&
            obj1.y + bounds1.height > obj2.y
        );
    }
    

    // Função para encerrar o jogo
    gameOver() {
        this.gameOverFlag = true;
        alert("Game Over!");
        this.voltarAoMenu();
    }

    // Função para voltar ao menu
    voltarAoMenu() {
        // Implementar lógica para voltar ao menu
    }
}