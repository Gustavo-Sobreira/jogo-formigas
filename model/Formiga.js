class Formiga {
    constructor({stage, image,posX, posY, vida, velocidade}) {
        this.stage = stage;
        this.sprite = new createjs.Bitmap(image);

        this.sprite.x = posX;
        this.sprite.y = posY;
        // Define os limites do personagem
        const bounds = { x: this.sprite.x, y: this.sprite.y, width: image.width, height: image.height };
        this.sprite.getBounds = () => bounds;

        // Atributos da formiga
        this.vida = vida;
        this.velocidade = velocidade;
        this.carregandoFolha = false;

        stage.addChild(this.sprite);
    }

    update(teclas) {
        const bounds = this.sprite.getBounds();
        const canvasWidth = this.stage.canvas.width;
        const canvasHeight = this.stage.canvas.height;
    
        if (teclas["ArrowUp"] && this.sprite.y > 0) {
            this.sprite.y -= this.velocidade;
        }
        if (teclas["ArrowDown"] && this.sprite.y < canvasHeight - bounds.height) {
            this.sprite.y += this.velocidade;
        }
        if (teclas["ArrowLeft"] && this.sprite.x > 0) {
            this.sprite.x -= this.velocidade;
            this.sprite.scaleX = -1;
        }
        if (teclas["ArrowRight"] && this.sprite.x < canvasWidth - bounds.width) {
            this.sprite.x += this.velocidade;
            this.sprite.scaleX = 1;
        }
    }
    

    upVida() {
        this.vida += 10;
    }

    downVida() {
        this.vida -= 1;
    }

    upVelocidade() {
        this.velocidade += 0.5;
    }

    downVelocidade() {
        this.velocidade -= 0.1;
    }

    voltarParaFormigueiro(formigueiro) {
        this.sprite.x = formigueiro.sprite.x;
        this.sprite.y = formigueiro.sprite.y;
    }
}