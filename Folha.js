class Folha {
  constructor(stage, image) {
      this.stage = stage;
      this.sprite = new createjs.Bitmap(image);

      // Posiciona a folha em uma posição aleatória
      this.sprite.x = Math.random() * (stage.canvas.width - image.width);
      this.sprite.y = Math.random() * (stage.canvas.height - image.height);

      // Define o tamanho da folha
      this.sprite.setBounds(0, 0, 20, 20);

      stage.addChild(this.sprite);
  }
}