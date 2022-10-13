var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount,gameState;
var pista
var carro1, carro1Img
var carro2, carro2Img
var carros = []
var allPlayers
var fuels, fuelImg
var powerCoins, powerCoinsImg
var obstacles, obstacle1Image, obstacle2Image
var lifeImg
var blastImage

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  pista = loadImage("./assets/track.jpg")
  carro1Img = loadImage("./assets/car1.png")
  carro2Img = loadImage("./assets/car2.png")
  fuelImg = loadImage("./assets/fuel.png")
  powerCoinsImg = loadImage("./assets/goldCoin.png")
  obstacle1Image = loadImage("./assets/obstacle1.png")
  obstacle2Image = loadImage("./assets/obstacle2.png")
  lifeImg= loadImage("./assets/life.png")
  blastImage = loadImage("./assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount == 2){
    game.updateState(1)
  }

  if(gameState == 1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
