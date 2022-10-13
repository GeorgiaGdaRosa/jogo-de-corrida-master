class Player {
  constructor() {
    this.name= null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.rank= 0
    this.score = 0
    this.fuel = 185
    this.life = 185
  }

  addPlayer(){
    var playerIndex = "players/player"+this.index 
    if (this.index==1) {
      this.positionX = width/2-100
    } else {
      this.positionX = width/2+100
    }
    database.ref(playerIndex).set({
      name:this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score,
      life:this.life 
    })
  }

  update(){
    var playerIndex = "players/player"+ this.index
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
      score:this.score,
      life: this.life
    })
  }

  getDistance(){
    var playerIndex = "players/player"+ this.index
    database.ref(playerIndex).on("value",data=>{
      var data = data.val()
      this.positionX= data.positionX
      this.positionY = data.positionY 
    })
  }

  getCount(){
    database.ref("playerCount").on("value",data=>{
      playerCount= data.val()
    })
  
  }

  updateCount(count){
    database.ref("/").update({playerCount:count})
  }

  static getPlayersInfo(){
    database.ref("players").on("value",data =>{
      allPlayers = data.val()
    })
  } 
  
  getCarsAtEnd() {
    database.ref("carsAtEnd").on("value", data => {
      this.rank = data.val();
    });
  }

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    });
  }


}
