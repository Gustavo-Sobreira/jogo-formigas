class Formiga {
    constructor({stage, image,posX, posY, vida, velocidade, defesa}) {
        this.stage = stage;
        this.sprite = new createjs.Bitmap(image);

        this.sprite.x = posX;
        this.sprite.y = posY;
        // Define manualmente os bounds
        const bounds = { x: this.sprite.x, y: this.sprite.y, width: image.width, height: image.height };
        this.sprite.getBounds = () => bounds;

        // Atributos da formiga
        this.vida = vida;
        this.velocidade = velocidade;
        this.defesa = defesa;
        this.carregandoFolha = false;

        stage.addChild(this.sprite);
    }

    update(teclas) {
        // Largura e altura do canvas dinâmicas
        const canvasWidth = this.stage.canvas.width;
        const canvasHeight = this.stage.canvas.height;

        if (teclas["ArrowUp"] && this.sprite.y > 0) {
            this.sprite.y -= this.velocidade;
        }
        if (teclas["ArrowDown"] && this.sprite.y < canvasHeight - this.sprite.getBounds().height) {
            this.sprite.y += this.velocidade;
        }
        if (teclas["ArrowLeft"] && this.sprite.x > 0) {
            this.sprite.x -= this.velocidade;
        }
        if (teclas["ArrowRight"] && this.sprite.x < canvasWidth - this.sprite.getBounds().width) {
            this.sprite.x += this.velocidade;
        }
    }

    upVida() {
        this.vida += 1;
    }

    downVida() {
        this.vida -= 1;
    }

    upVelocidade() {
        this.velocidade += 0.1;
    }

    downVelocidade() {
        this.velocidade -= 0.1;
    }

    upDefesa() {
        this.defesa += 1;
    }

    downDefesa() {
        this.defesa -= 1;
    }

    voltarParaFormigueiro(formigueiro) {
        this.sprite.x = formigueiro.sprite.x;
        this.sprite.y = formigueiro.sprite.y;
    }
}