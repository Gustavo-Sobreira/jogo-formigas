// Inicializa a fila de carregamento (PrelodJS)
const filaDeCarregamento = new createjs.LoadQueue();
filaDeCarregamento.installPlugin(createjs.Sound);
filaDeCarregamento.loadManifest([
    { id: "formiga", src: "assets/formiga.png", width: 24, height: 24 },
    { id: "formiga-folha", src: "assets/formiga-folha.png", width: 24, height: 24 },
    { id: "folha", src: "assets/folha.png", width: 16, height: 16 },
    { id: "inimigo", src: "assets/inimigo.png", width: 24, height: 24 },
    { id: "formigueiro", src: "assets/formigueiro.png", width: 64, height: 64 },
    { id: "fundo", src: "assets/fundo.png" },
    { id: "musicaDeFundo", src: "assets/ambiente.mp3" },
]);

// Configurações de som
let volumeAtual = 0.5; // Volume inicial
let somAtivado = true; // Controle do som

// Cria o botão de início (SoundJS)
const botaoIniciar = criarBotao("Iniciar Jogo", () => {
    createjs.Sound.play("musicaDeFundo", { loop: -1, volume: volumeAtual });
    document.body.removeChild(botaoIniciar); // Remove o botão de iniciar
    carregarRecursosConcluidos(filaDeCarregamento);
}, {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer"
});
document.body.appendChild(botaoIniciar);

// Controles de dificuldade
const containerDificuldade = criarContainerVertical(250);
document.body.appendChild(containerDificuldade);

adicionarBotaoDificuldade(containerDificuldade, "Fácil", "easy", "#4CAF50");
adicionarBotaoDificuldade(containerDificuldade, "Médio", "medium", "#FFC107");
adicionarBotaoDificuldade(containerDificuldade, "Sobrevivência", "survival", "#F44336");

// Controles de volume
const containerVolume = criarContainerVertical(10);
document.body.appendChild(containerVolume);

adicionarBotaoVolume(containerVolume, "Aumentar Volume", () => ajustarVolume(0.1));
adicionarBotaoVolume(containerVolume, "Diminuir Volume", () => ajustarVolume(-0.1));
adicionarBotaoVolume(containerVolume, "Desligar Som", () => alternarSom());

// Funções auxiliares
function criarBotao(texto, eventoClique, estilos = {}) {
    const botao = document.createElement("button");
    botao.textContent = texto;
    Object.assign(botao.style, estilos);
    botao.addEventListener("click", eventoClique);
    return botao;
}

function criarContainerVertical(marginTop) {
    const container = document.createElement("div");
    container.style = `position: absolute; top: ${marginTop}px; left: 10px; display: flex; flex-direction: column; gap: 5px;`;
    return container;
}

function adicionarBotaoDificuldade(container, texto, dificuldade, corFundo) {
    const botao = criarBotao(texto, () => game.setDifficulty(dificuldade), {
        padding: "4px 8px",
        fontSize: "12px",
        backgroundColor: corFundo,
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s"
    });
    container.appendChild(botao);
}

function adicionarBotaoVolume(container, texto, acao) {
    const botao = criarBotao(texto, acao, {
        padding: "4px 8px",
        fontSize: "12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s"
    });
    container.appendChild(botao);
}

function ajustarVolume(delta) {
    volumeAtual = Math.min(1, Math.max(0, volumeAtual + delta));
    if (somAtivado) createjs.Sound.setVolume(volumeAtual);
}

function alternarSom() {
    somAtivado = !somAtivado;
    createjs.Sound.setVolume(somAtivado ? volumeAtual : 0);
}

// Inicializa o canvas
function init() {
    const canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    window.stage = stage;
}

// Manipula recursos carregados
function carregarRecursosConcluidos(fila) {
    const canvas = document.getElementById("gameCanvas");
    const stage = new createjs.Stage(canvas);
    adicionarImagemDeFundo(stage, fila.getResult("fundo"));
    window.game = new Game(stage, fila);
    game.start();
}

function adicionarImagemDeFundo(stage, imagem) {
    const fundo = new createjs.Bitmap(imagem);
    fundo.scaleX = stage.canvas.width / imagem.width;
    fundo.scaleY = stage.canvas.height / imagem.height;
    stage.addChildAt(fundo, 0);
    stage.update();
}

init();
