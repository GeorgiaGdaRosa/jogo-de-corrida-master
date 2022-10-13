class Game {
  constructor() {
    
    this.resetButton=createButton("")
    this.resetTittle = createElement("h2")
    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false
    this.leftKeyActive = false
    this.blast = false
  }

  start() {
    player = new Player();
    playerCount = player.getCount()
    form = new Form();
    form.display();
    carro1 = createSprite(width/2-50,height-100)
    carro1.addImage("carro1",carro1Img)
    carro1.addImage("blast",blastImage)
    carro1.scale = 0.07
    carro2 = createSprite(width/2+50,height-100)
    carro2.addImage("carro2",carro2Img)
    carro2.addImage("blast", blastImage)
    carro2.scale = 0.07
    carros = [carro1,carro2]
    fuels = new Group()
    powerCoins = new Group()
    obstacles = new Group()
    this.addSprites(powerCoins,18,powerCoinsImg,0.09)
    this.addSprites(fuels,4,fuelImg,0.02)
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    this.addSprites(obstacles,obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
      if (positions.length>0) {
        x = positions[i].x 
        y = positions[i].y
        spriteImage = positions[i].image 
      } else { 
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  getState(){
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value",data=>{
      gameState= data.val()
    })
  }

  updateState(state){
    database.ref("/").update({gameState:state})
  }
  
  handleElements(){
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")
    this.resetTittle.html("Reset")
    this.resetTittle.position(width/2+230,40)
    this.resetTittle.class("resetText")
    this.resetButton.position(width/2+230,100)
    this.resetButton.class("resetButton")
    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
    
    
  }

  play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    if(allPlayers != undefined){
      image(pista,0,-height*5,width,height*6)
      this.showLeaderboard()
      this.showLife()
      this.showFuelBar()
      var index = 0
      for(var plr in allPlayers){
        index ++
        var x = allPlayers[plr].positionX
        var y = height-allPlayers[plr].positionY
        var currentLife = allPlayers[plr].life
        if(currentLife<= 0){
          carros[index-1].changeImage("blast")
          carros[index-1].scale = 0.3
        }
        carros[index-1].position.x = x 
        carros[index-1].position.y = y 
        if(index===player.index){
          stroke(10)
          fill("blue")
          ellipse(x,y,60,60)
          this.handleFuel(index)
          this.handlePowerCoins(index)
          this.handleObstacleCollision(index)
          this.handleCarACollisionWithCarB(index)
          if(player.life<=0){
            this.blast= true
            this.playerMoving = false
          }
          if(this.blast){
            setTimeout(() => {
              gameState = 2
              this.gameOver()
            }, 2000);
          }
          camera.position.y=carros[index-1].position.y
        }
      }
      this.handlePlayerControl()
      const finishLine=height*6-100
      if(player.positionY>finishLine){
        gameState=2
        player.rank++
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }
      if(this.playerMoving){
        player.positionY += 5
        player.update()
      }
      drawSprites()
    }
    
  

  }

  handleResetButton(){
  this.resetButton.mousePressed(()=>{
    database.ref("/").set({
      gameState:0,
      playerCount:0,
      players:{},
      carsAtEnd:0
    })
    window.location.reload()
  })

  }


  handlePlayerControl(){
    if(!this.blast){
      if(keyIsDown(UP_ARROW)){
      player.positionY+=10
      player.update()
      this.playerMoving = true
    }

    if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
      player.positionX-=5
      this.leftKeyActive = true
      player.update()
    }

    if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
      player.positionX+=5
      this.leftKeyActive = false 
      player.update()
    }}
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handleFuel(index) {
    //adicionando combustível
    carros[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
    if(player.fuel>0 && this.playerMoving){
      player.fuel -= 0.3
    }

    if(player.fuel<=0){
      gameState= 2
      this.gameOver()
    }
  }

  handlePowerCoins(index) {
    carros[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 21;
      player.update();
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
  }


  showRank() {
    swal({
      //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      title: `Incrível!${"\n"}${player.rank}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }

  showLife() {
    push();
    image(lifeImg, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    //seu código aqui...
    push()
    image(fuelImg,width / 2 - 130, height - player.positionY - 330, 20,20)
    fill("white")
    rect(width / 2 - 100, height - player.positionY - 330, 185, 20)
    fill("yellow")
    rect(width / 2 - 100, height - player.positionY - 330, player.fuel, 20)
    noStroke()
    pop()
  }

  handleObstacleCollision(index) {
    if (carros[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
       }

      //Reduzindo a vida do jogador
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (carros[index - 1].collide(carros[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (carros[index - 1].collide(carros[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }

}



