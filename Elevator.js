
class Elevator {
  constructor(numberOfFloors, currentFloor, isMoving, areDoorsOpen, movingDirection, nextFloor) {
    this.numberOfFloors = numberOfFloors;
    this.currentFloor = currentFloor;
    this.isMoving = isMoving;
    this.areDoorsOpen = areDoorsOpen;
	this.movingDirection = movingDirection;
	this.isOccupied = false;
	this.isBusy = false;
	this.isAtDestination = false;
	this.intervalId= setInterval(this.watcher.bind(this), 100); // Setting up the interval
  }
	
    async openDoors(){

        return new Promise(async (resolve, reject) => {
            console.log("Doors are opening")

            await delay(2000)
            this.areDoorsOpen = true;
            console.log("Doors opened.")
            resolve();
        });
    }
    async closeDoors(){

        return new Promise(async (resolve, reject) => {
            console.log("Doors are closing")

            await delay(2000)
            this.areDoorsOpen = false;
            console.log("Doors closed")
            resolve();
        });
    }

    updateDirection(){
        if (callQueue.front()){
            if (this.currentFloor > callQueue.front().requestFloor){

                this.movingDirection = "DOWN";
            }
            else{

                this.movingDirection = "UP";
            }
        }
    }

    watcher(){
       this.updateDirection();
    }





  async moveOneFloor(){
    if (this.movingDirection == "DOWN"){
        await this.moveDown();

    }
    else{

        await this.moveUp();
    }
  }


  async moveElevator() {
        this.isBusy = true;
        if (this.areDoorsOpen){

            await this.closeDoors();

        }
        while (this.currentFloor != callQueue.front().requestFloor){

            this.isMoving = true;
            this.isAtDestination = false;
            
    	    await this.moveOneFloor();

        }
        // replace with actual waiting function? (sa se dea jos entitatile/ sa urce?) - un await care primeste resolve doar atunci cand nu exista entities getting out sau getting in
        // alternativa: in functia de check care cheama moveElevator sa adaugi verificarile pt pornire - sa nu ai wait aici - poate doar pt open/close doors
        await this.openDoors();
        this.isAtDestination = true;
        this.isBusy = false;
        this.isMoving = false;

        callQueue.dequeue();

    }
    // ANIMATION FUNCTIONS


    async moveDown(){


        var startPosition = parseInt(elevator.style.bottom);
        var distance = sizer.calculateFloorHeight();
        var destination = startPosition - distance;
        var newPosition = startPosition;

        while(Math.abs(newPosition - destination) > 1){

            await delay(20);
            newPosition -= distance / 50;
            elevator.style.bottom = newPosition + 'px';
        }
            this.currentFloor -= 1;

            return;


    }
    async moveUp(){

        var startPosition = parseInt(elevator.style.bottom);
        var distance = sizer.calculateFloorHeight();
        var destination = startPosition + distance;
        var newPosition = startPosition;

        while(Math.abs(newPosition - destination) > 1){
            //console.log("move in while")
            await delay(20);

            newPosition += distance / 50;

            elevator.style.bottom = newPosition + 'px';
        }
            this.currentFloor += 1;

            return;

    }


}


