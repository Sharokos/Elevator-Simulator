// ITI TREBUIE ACTUAL POSITION SI PROBABIL ACTUAL DIMENSIONS LA TOATE
class Entity {
  static nextId = 1;
  constructor(type, drawing, htmlId, currentFloor, direction,desiredFloor) {
    this.type = type;

    this.drawing = drawing;
    this.htmlId = "entity" + Entity.nextId++;
    this.currentFloor = currentFloor;
    this.spawnFloor = currentFloor;
    this.direction = direction;
    this.desiredFloor = desiredFloor;
    // States:

    this.state = "IDLE";
    this.oldState = "IDLE";
    this.travelComplete = false;
    this.callTaken = false;
    this.intervalId= setInterval(this.watcher.bind(this), 100); // Setting up the interval
    this.sizer = new SizeCalculator();
    this.isInside = false;


  }

  static generateEntity(rand, floor, desiredFloor){

      var size = rand.getRandomInt(10,15)
      var left = rand.getRandomInt(1,100)/100

      var drawing = new DrawingProperties(size, 0.5, "random", "path", left, "portrait");

      console.log("Creating entity at : " + floor + " wanting to go to: " + desiredFloor);
      return new Entity("random",drawing, 0, floor, "random",desiredFloor);
  }

  isElevatorHere(){

    return (thisElevator.currentFloor == this.currentFloor) && (this.state == "WAITING") ? true : false;
  }
  isEntityArrived(){
    return (this.currentFloor == this.desiredFloor) && (!thisElevator.isMoving) && (this.spawnFloor != this.desiredFloor) && (this.state != "OUTSIDE ELEVATOR") ? true : false;
  }

  // poate poti calcula etajul de la lift (if inside) -> stii spawn floor si apoi cat e in lift updatezi constant etajul pana la destinatie!
  updateCurrentFloor(){

    var floorBot = sizer.getAbsoluteBot(this.htmlId)

//    console.log(floorBot)
//    console.log(sizer.getAbsoluteBot("floor" + floors[0].floorNumber))
    for (let i = 0; i < floors.length ;i++){
        var currFloor = sizer.getAbsoluteBot("floor" + floors[i].floorNumber)

        if (Math.abs(currFloor - floorBot) < 15){
            this.currentFloor = floors[i].floorNumber
        }
    }



  }
  // This is only for visual reasons
  addEntityToElevator(){
    const entityVisual = document.getElementById(this.htmlId);
    elevator.appendChild(entityVisual);
    entityVisual.style.left = parseInt(entityVisual.style.left) - 100 + "px";


  }
  // This is only for visual reasons
  addEntityToFloor(){
    const floor = document.getElementById("floor" + this.desiredFloor);
    floor.appendChild(entityVisual)
    entityVisual.style.left = parseInt(entityVisual.style.left) + 100 + "px";
  }

  async getInside(){
    var elevatorPosition = parseInt(elevator.style.left); // poate o poti face cumva o proprietate a liftului updatata constant din sizer?
    this.state = "GETTING IN";
    await this.moveTo(elevatorPosition);
    this.addEntityToElevator();
    this.state = "INSIDE"
  }
  async getOutside(){
    var elevatorPosition = parseInt(elevator.style.left); // poate o poti face cumva o proprietate a liftului updatata constant din sizer?
    this.state = "GETTING OUT";
    await this.moveTo(elevatorPosition + 100);
    this.addEntityToFloor();
    this.state = "OUTSIDE"
  }
  // poate adaugi si !isElevatorMoving pt astea ca sa eviti orice zambra
  getInDecider(){
    // Make sure you get in only if: elevator is present, doors are open and entity is waiting
    if (this.isElevatorHere() && this.state == "WAITING" && thisElevator.areDoorsOpen){
        this.state = "READY TO GET IN";
        console.log("Going in!")
    }

  }

  getOutDecider(){
    // Make sure the elevator is stopped at the destination, the entity is at the desired floor and of course the doors are open
      if (thisElevator.isAtDestination && this.state == "AT DESTINATION" && thisElevator.areDoorsOpen){
          this.state = "READY TO GET OUT";
          console.log("Going out!")
      }

    }
  watcher(){
//    if (!this.travelComplete){
//        this.isElevatorHere() ? this.state = "GETTING IN" : this.state += "";
//        this.isEntityArrived() ? this.state = "GETTING OUT" : this.state += "";
//    }
    this.getInDecider();
    this.getOutDecider();
    // in state watcher adaugi toate eventurile care trebuie sa aiba loc in functie de starea entitatii
    this.stateWatcher();
    this.updateCurrentFloor();
  }


    // poate o refactor ca la elevator
  async moveTo(destination, action){

    return new Promise(async (resolve, reject) => {
        const entityVisual = document.getElementById(this.htmlId);
        this.state = "MOVING";
        var startTime = null;
        const duration = 1000;
        const self = this;
        var startPosition = parseInt(entityVisual.style.left);
        var distance = Math.abs(startPosition - destination);
        if ( startPosition < destination){
            this.direction = "RIGHT";
        }
        else{
            this.direction = "LEFT";
        }
        var newPosition = 0;
        var speed = 0.5;


//        if ((action == "GET IN") || (action = "GET OUT")){
//            await this.waitForDoors();
//        }
        function animateRight(timestamp) {
            if (!startTime) startTime = timestamp;

            var progress = timestamp - startTime;
            var elapsedTime = progress;
            newPosition = startPosition + speed * elapsedTime;
            entityVisual.style.left = newPosition + 'px';

            if ( Math.abs(newPosition - destination) < 5){




                    resolve();
                    return
                    }
            requestAnimationFrame(animateRight);

        }
        function animateLeft(timestamp) {
            if (!startTime) startTime = timestamp;

            var progress = timestamp - startTime;
            var elapsedTime = progress;
            newPosition = startPosition - speed * elapsedTime;

            entityVisual.style.left = newPosition + 'px';

            if ( Math.abs(newPosition - destination) < 5){



                resolve();
                return
            }
            requestAnimationFrame(animateLeft);
        }

        if (this.direction == "RIGHT"){
            requestAnimationFrame(animateRight);

        } else{
            requestAnimationFrame(animateLeft);
        }
      });


  }

    // fara async aici poate? setezi starea pe waiting si apoi sa ai ceva intr-un watcher... if waiting si elevatorHere -> state = getIn si urci
    callElevator(){
        //console.log(this.htmlId)
        createExternalRequest(this.currentFloor, "DOWN");
        this.state = "WAITING";
    }


    makeElevatorRequest(){
        createInternalRequest(this.desiredFloor);
        this.state = "REQUEST TAKEN"
    }

    displayPosition(){
        console.log("Id: " + this.htmlId)
        console.log("state? " + this.state)
        console.log("floor? " + this.currentFloor)
        console.log("is inside? " + this.isInside)
        console.log("travel complete? " + this.travelComplete)
        console.log("call taken? " + this.callTaken)
    }


    static getEntitiesForFloor(floorNumber){
        var returnEntities = []
        for (var ent of entities){
            if (ent.currentFloor == floorNumber){
                returnEntities.push(ent)
            }

        }
        return returnEntities;
    }

    static getEntityById(id){
            var returnEntity = null;
            for (var ent of entities){
                if (ent.htmlId == id){
                    returnEntity = ent;
                }

            }
            return returnEntity;
    }

    drawEntity(floorId){
        const objectVisual = document.createElement('div');
        const floorVisual = document.getElementById(floorId);
        objectVisual.setAttribute('class', 'entityVisual');
        objectVisual.setAttribute('id', this.htmlId);
        objectVisual.innerHTML = this.state + " " + this.callTaken;


        objectVisual.style.height = sizer.calculateObjectSize(this)[1] + "px";
        objectVisual.style.width = sizer.calculateObjectSize(this)[0] + "px";
        objectVisual.style.left = sizer.calculateObjectPosition(this) + "px";
        objectVisual.style.bottom = "0px";
        floorVisual.appendChild(objectVisual);



      }

      async stateWatcher(){

        if (this.state != this.oldState) {
            const objectVisual = document.getElementById(this.htmlId);
            objectVisual.innerHTML = this.state + " " + this.callTaken ;
//            console.log("State change for entityID: " + this.htmlId);
//            console.log("State change from: " + this.oldState  + " to: " + this.state);
            this.oldState = this.state;
            if (this.state == "READY TO GET IN"){
                await this.getInside();
            }
            if (this.state == "READY TO GET OUT"){
                await this.getOutside();
            }
//            if (this.state == "INSIDE"){
//                this.addEntityToElevator();
//            }
//            if (this.state == "GETTING OUT"){ //vezi daca nu e mai bine sa faci cu state == outside
//                this.addEntityToFloor();
//            }
        }

      }

}


