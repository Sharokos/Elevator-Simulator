
class Elevator {
  constructor(numberOfFloors, currentFloor, isMoving, areDoorsOpen, movingDirection, nextFloor) {
    this.numberOfFloors = numberOfFloors;
    this.currentFloor = currentFloor;
    this.isMoving = isMoving;
    this.areDoorsOpen = areDoorsOpen;
    this.areDoorsMoving = false;
	this.movingDirection = movingDirection;
	this.isOccupied = false;
	this.isBusy = false;
	this.isAtDestination = false;
	this.intervalId= setInterval(this.watcher.bind(this), 100); // Setting up the interval
	this.doorsInterval= setInterval(this.doorsWatcher.bind(this), 5500); // Setting up the interval
  }


	//TODO: Sometimes the elevator remains busy (with an entity blocked inside) and there is no way of removing that state
    async openDoors(){
        return new Promise(async (resolve, reject) => {
            console.debug("Doors are opening")
            this.areDoorsMoving = true;
            await delay(2000)
            this.areDoorsOpen = true;
            console.debug("Doors opened.")
            this.areDoorsMoving = false;
            resolve();
        });
    }

    // poate in loc de areDoorsMoving sa adaugi doorsState si sa ai CLOSING SI OPENING ca sa gestionezi mai clar
    async closeDoors(){
        return new Promise(async (resolve, reject) => {
            console.debug("Doors are closing")
            this.areDoorsMoving = true;
            await delay(2000)
            this.areDoorsOpen = false;
            this.areDoorsMoving = false;
            console.debug("Doors closed")
            resolve();
        });
    }

    busyReset(){
        if(!this.isMoving && !this.isOccupied){
            this.isBusy = false;
        }
    }
    isSomeoneStillAtDestination(){
        if(Entity.getEntitiesAtDestination().length > 0){
            return true;
        }
        return false;
    }
    async doorsWatcher(){
        if (!this.isMoving){
            var inOrOutEntities = Entity.getEntitiesByFloorAndState(this.currentFloor, "GETTING IN").concat(Entity.getEntitiesByFloorAndState(this.currentFloor, "GETTING OUT"));

            if (inOrOutEntities.length == 0){
                if (this.areDoorsOpen){

                    await this.closeDoors();

                }
            }
        }
    }
    // poate un watcher care sa decida cand liftul e busy in loc sa ai sapte mii de verificari
    // si inca unul care decide cand nu mai e busy?
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
       this.clearQueue();
       this.occupationUpdater();
       this.busyReset();
    }



  clearQueue(){
    var insideEntities = Entity.getEntitiesInside();
    for (var insEnt of insideEntities){
        if (insEnt.state == "INSIDE"){
            for (var call of callQueue.items){

                if(insEnt.htmlId == call.callerId){
                    if (call.type == "external"){
                        callQueue.removeItem(call);
                    }
                }
            }
        }
    }
  }
  occupationUpdater(){
    if (Entity.getEntitiesInside().length == 0){
        this.isOccupied = false;
    }
    else{
        this.isOccupied = true;
    }
  }


  async moveOneFloor(){
    if (this.movingDirection == "DOWN"){
        await this.moveDown();

    }
    else{

        await this.moveUp();
    }
  }


  async startElevator(){
    if (this.currentFloor != callQueue.front().requestFloor){
        this.moveElevator();
    }
    else{
        this.isBusy = true;
        if (!this.areDoorsOpen){

            await this.openDoors();

        }
        callQueue.dequeue();

    }

  }
  async moveElevator() {
        this.isMoving = true;
        this.isBusy = true;
        if (this.areDoorsOpen){

            await this.closeDoors();

        }
        // Only open the doors if not already opened

        while (this.currentFloor != callQueue.front().requestFloor){


            this.isAtDestination = false;
            
    	    await this.moveOneFloor();

        }
        // replace with actual waiting function? (sa se dea jos entitatile/ sa urce?) - un await care primeste resolve doar atunci cand nu exista entities getting out sau getting in
        // alternativa: in functia de check care cheama moveElevator sa adaugi verificarile pt pornire - sa nu ai wait aici - poate doar pt open/close doors
        await this.openDoors();

        // functie chemata din entity care ii seteaza starea daca e etajul ei

        this.isAtDestination = true;
        this.isBusy = false;
        this.isMoving = false;
        Entity.setArrivalStatusForEntities(this.currentFloor);
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
            elevator.style.bottom = destination + 'px';
            return;


    }
    async moveUp(){

        var startPosition = parseInt(elevator.style.bottom);
        var distance = sizer.calculateFloorHeight();
        var destination = startPosition + distance;
        var newPosition = startPosition;

        while(Math.abs(newPosition - destination) > 1){
            //console.debug("move in while")
            await delay(20);

            newPosition += distance / 50;

            elevator.style.bottom = newPosition + 'px';
        }
            this.currentFloor += 1;
            elevator.style.bottom = destination + 'px';
            return;

    }


}


