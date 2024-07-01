// ITI TREBUIE ACTUAL POSITION SI PROBABIL ACTUAL DIMENSIONS LA TOATE
class Player {

  constructor(playerVisual) {
    this.state = "IDLE";
    this.isInside = false;
    this.watcherId= setInterval(this.watcher.bind(this), 100); // Setting up the interval
    this.playerVisual = playerVisual;
  }

  static spawnPlayer(floor){

      var left = 200;
      const playerVisual = document.createElement('div')
      playerVisual.setAttribute('class', 'player')
      playerVisual.setAttribute('id', 'player')
      playerVisual.style.height = "50px"
      playerVisual.style.width = "25px"
      playerVisual.style.left = "200px"
      playerVisual.style.bottom = "0px"

      var floorVisual = document.getElementById("floor" + floor)
      floorVisual.appendChild(playerVisual);
      return new Player(playerVisual);
  }
  moveLeft(){
    if (!this.isInside){
        this.state = "MOVING";
        var startPosition = parseInt(this.playerVisual.style.left);
        var newPosition = startPosition;

        newPosition -= 10;


        this.playerVisual.style.left = newPosition + 'px';
    }
  }

  moveRight(){
    if (!this.isInside){
        this.state = "MOVING";
        var startPosition = parseInt(this.playerVisual.style.left);
        var newPosition = startPosition;

        newPosition += 10;

        this.playerVisual.style.left = newPosition + 'px';
    }
  }

  getInsideElevator(){
    // iei visualul elevator + append
    this.state = "INSIDE";
    this.isInside = true;

  }

  getOutsideElevator(){
      // iei visualul etajului (cum il afli? cu functia de calculate floor sau iei currentFloor al elevator) + append
      this.state = "OUTSIDE";
      this.isInside = false;

    }
  isPlayerAtElevatorButtons(){

    if (parseInt(this.playerVisual.style.left) > absoluteBtnsPosition - 30 && parseInt(this.playerVisual.style.left) < absoluteBtnsPosition + 30){
        return true;
    }
    return false;
  }
  isPlayerAtElevator(){

      if (parseInt(this.playerVisual.style.left) > elevatorSpawnPosition - 5 && parseInt(this.playerVisual.style.left) < elevatorSpawnPosition + 80){ // aici vei adauga width-ului liftului
          return true;
      }
      return false;
    }
  watcher(){
    if(this.isPlayerAtElevatorButtons()){
        console.log("AT BUTTONS!")
    }
    if(this.isPlayerAtElevator()){
        console.log("AT ELEVATOR!")
    }

  }

}


