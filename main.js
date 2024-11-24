const queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);
queue.loadManifest([
    { id: "formiga", src: "assets/formiga.png", with: 24, height: 24 },
    { id: "formiga-folha", src: "assets/formiga-folha.png", with: 24, height: 24 },
    { id: "folha", src: "assets/folha.png", with: 16, height: 16 },
    { id: "inimigo", src: "assets/inimigo.png", with: 24, height: 24 },
    { id: "formigueiro", src: "assets/formigueiro.png", with: 64, height: 64 },
    { id: "fundo", src: "assets/fundo.png" },
    { id: "backgroundMusic", src: "assets/ambiente.mp3" },
]);

const startButton = document.createElement("button");
startButton.textContent = "Iniciar Jogo";
startButton.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
document.body.appendChild(startButton);

startButton.addEventListener("click", () => {
    createjs.Sound.play("backgroundMusic", { loop: -1, volume: 0.5 });
    document.body.removeChild(startButton);
    handleComplete(queue);
});
function adicionarImagemDeFundo(stage, image) {
    // Cria um Bitmap com a imagem de fundo
    const fundo = new createjs.Bitmap(image);

    // Ajusta o tamanho do canvas ao tamanho da imagem de fundo (opcional)
    fundo.scaleX = stage.canvas.width / image.width;
    fundo.scaleY = stage.canvas.height / image.height;

    // Adiciona o Bitmap ao estágio
    stage.addChildAt(fundo, 0); // Adiciona no fundo, atrás dos outros elementos
}


function handleComplete(queue) {
    const canvas = document.getElementById("gameCanvas");
    const stage = new createjs.Stage(canvas);
    adicionarImagemDeFundo(stage, queue.getResult("fundo"));
    window.game = new Game(stage, queue);
    game.start();
}

function init() {
    const canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    canvas.width = 1600;
    canvas.height = 800;
    document.body.appendChild(canvas);
}

init();