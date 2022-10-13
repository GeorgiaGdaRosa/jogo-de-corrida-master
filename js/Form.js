class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png", "nome do jogo");
    this.greeting = createElement("h2");
  }

  setElementsPosition(){
    this.titleImg.position(120,0)
    this.input.position(width/2-100,height/2-80)
    this.playButton.position(width/2-90,height/2-20)
    this.greeting.position(width/2-300,height/2-100)
  }

  setElementsStyle(){
    this.input.class('customInput')
    this.playButton.class('customButton')
    this.titleImg.class('gameTitle')
    this.greeting.class("greeting")
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  handleMousePressed(){
    this.playButton.mousePressed( ()=>{
      this.input.hide()
      this.playButton.hide()
      var mensagem = `${this.input.value()}<br>
      Esperando por outros jogadores`
      this.greeting.html(mensagem)
      playerCount ++ 
      player.name = this.input.value()
      player.index = playerCount
      player.addPlayer()
      player.updateCount(playerCount)
      player.getDistance()
    }
    )
  }

  display(){
    this.setElementsPosition()
    this.setElementsStyle()
    this.handleMousePressed()
  }

}
