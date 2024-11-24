class Game {
    constructor(stage, queue) {
        this.stage = stage;
        this.queue = queue;
        this.pontos = 0;
        this.folhasDisponiveis = 0;
        this.teclas = {};

        this.posX = 200;
        this.posY = 300;
        this.totalInimigos = 1;

        this.formiga = new Formiga({
            stage: stage,
            image: queue.getResult("formiga"),
            posX: this.posX,
            posY: this.posY,
            vida: 20,
            velocidade: 1,
            defesa: 1,
        });

        this.formigueiro = new Formigueiro({
            stage: stage,
            image: queue.getResult("formigueiro"),
            posX: this.posX,
            posY: this.posY,
            radius: queue.getResult("formigueiro").width / 2,
        });

        // Array para armazenar folhas
        this.folhas = [new Folha(stage, queue.getResult("folha"))];
        
        if (this.folhasDisponiveis === 0) {
            this.criarNovaFolha();
        }
    
        this.inimigos = [];
        this.spawnInimigos(this.totalInimigos);

    //  Eventos para os botões de compra
        document.getElementById("defesa").addEventListener("click", () => this.comprarDefesa());
        document.getElementById("velocidade").addEventListener("click", () => this.comprarVelocidade());
        document.getElementById("vida").addEventListener("click", () => this.comprarVida());
        document.getElementById("casa").addEventListener("click", () => this.comprarCasa());

        window.addEventListener("keydown", (e) => (this.teclas[e.key] = true));
        window.addEventListener("keyup", (e) => (this.teclas[e.key] = false));
    }

    // Função para aumentar a defesa da formiga
    comprarDefesa() {
        if (this.pontos >= 1) {
            this.formiga.upDefesa();
            this.pontos--;
            document.getElementById("pontos").innerText = this.pontos;
        } else {
            alert("Você não tem pontos suficientes!");
        }
    }

    // Função para aumentar a velocidade da formiga
    comprarVelocidade() {
        if (this.pontos >= 1) {
            this.formiga.upVelocidade();
            this.pontos--;
            document.getElementById("pontos").innerText = this.pontos;
        } else {
            alert("Você não tem pontos suficientes!");
        }
    }

    // Função para aumentar a vida da formiga
    comprarVida() {
        if (this.pontos >= 1) {
            this.formiga.upVida();
            this.pontos--;
            document.getElementById("pontos").innerText = this.pontos;
        } else {
            alert("Você não tem pontos suficientes!");
        }
    }

    // Função para aumentar o raio do formigueiro
    comprarCasa() {
        if (this.pontos >= 2) { // Ajuste a quantidade de pontos necessária
            this.formigueiro.radius += 5; // Aumenta o raio
            this.pontos -= 2; // Deduz 2 pontos para comprar a melhoria
            document.getElementById("pontos").innerText = this.pontos;
        } else {
            alert("Você não tem pontos suficientes!");
        }
    }

    start() {
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
    }

    spawnInimigos(count) {
        for (let i = 0; i < count; i++) {
            const inimigo = new Inimigo({
                stage: this.stage,
                image: this.queue.getResult("inimigo"),
                velocidade: 0.5,
                ataque: 1,
            });
            inimigo.sprite.x = Math.random() * 800;
            inimigo.sprite.y = Math.random() * 600;
            this.inimigos.push(inimigo);
        }
    }

    criarNovaFolha() {
        const novaFolha = new Folha(this.stage, this.queue.getResult("folha"));
        this.folhas.push(novaFolha);
    }

    update(event) {
        this.formiga.update(this.teclas);
    
        this.inimigos.forEach((inimigo) => {
            inimigo.update(this.formiga, this.formigueiro, this.folhas);
        });
    
        // Verifica colisão com folhas
        this.folhas.forEach((folha, index) => {
            if (
                !this.formiga.carregandoFolha &&
                this.checkCollision(this.formiga.sprite, folha.sprite)
            ) {
                this.formiga.carregandoFolha = true;
                this.stage.removeChild(folha.sprite);
                this.folhas.splice(index, 1);
                this.formiga.sprite.image = this.queue.getResult("formiga-folha");
            }
        });
    
        // Verifica colisão com o formigueiro para entregar folha
        if (
            this.formiga.carregandoFolha &&
            this.checkCollision(this.formiga.sprite, this.formigueiro.sprite)
        ) {
            this.formiga.carregandoFolha = false;
            this.pontos++;
            document.getElementById("pontos").innerText = this.pontos;
            this.formiga.sprite.image = this.queue.getResult("formiga");

        }
    
        this.stage.update(event);
    }
    

    checkCollision(obj1, obj2) {
        const r1 = obj1.getBounds();
        const r2 = obj2.getBounds();

        return !(
            obj1.x > obj2.x + r2.width ||
            obj1.x + r1.width < obj2.x ||
            obj1.y > obj2.y + r2.height ||
            obj1.y + r1.height < obj2.y
        );
    }
}
