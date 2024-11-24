class Formigueiro {
    constructor({ stage, image, posX, posY, radius }) {
        this.stage = stage;

        // Forma para o círculo do formigueiro
        this.circle = new createjs.Shape();
        this.circle.graphics.beginFill("brown").drawCircle(0, 0, radius);
        this.circle.x = posX;
        this.circle.y = posY;

        // Adiciona o círculo ao palco
        stage.addChild(this.circle);

        // Adiciona a imagem do formigueiro sobre o círculo
        this.sprite = new createjs.Bitmap(image);
        this.sprite.x = posX - image.width / 2; // Centraliza a imagem
        this.sprite.y = posY - image.height / 2; // Centraliza a imagem
        stage.addChild(this.sprite);

        // Define os bounds para colisão
        this.radius = radius;
        this.posX = posX;
        this.posY = posY;
    }

    verificarColisao(obj) {
        const dx = obj.sprite.x - this.posX;
        const dy = obj.sprite.y - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const colidiu = dist < this.radius; // Verifica se está dentro do raio

        // Alterar a cor do círculo ao detectar colisão
        if (colidiu) {
            this.circle.graphics.clear().beginFill("red").drawCircle(0, 0, this.radius);
        } else {
            this.circle.graphics.clear().beginFill("brown").drawCircle(0, 0, this.radius);
        }

        return colidiu;
    }
}
