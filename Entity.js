// ITI TREBUIE ACTUAL POSITION SI PROBABIL ACTUAL DIMENSIONS LA TOATE
class Entity {
  static nextId = 1;
  constructor(type, drawing, htmlId, currentFloor, direction,desiredFloor) {
    this.type = type;

    this.drawing = drawing;
    this.htmlId = "entity" + Entity.nextId++;
    this.currentFloor = currentFloor;
    this.direction = direction;
    this.desiredFloor = desiredFloor;
    this.state = "IDLE";
    this.oldState = "IDLE";
    this.travelComplete = false;
    this.intervalId= setInterval(this.watcher.bind(this), 500); // Setting up the interval
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

    return (thisElevator.currentFloor == this.currentFloor) && (this.state == "WAITING") && (!this.travelComplete)  ? true : false;
  }
  isEntityArrived(){
    return (this.currentFloor == this.desiredFloor) && (!thisElevator.isMoving) ? true : false;
  }
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

  watcher(){
    this.isElevatorHere() ? this.state = "GETTING IN" : this.state += "";
    this.isEntityArrived() ? this.state = "GETTING OUT" : this.state += "";
    this.stateWatcher();
    this.updateCurrentFloor();
  }

  setInsideState(getInside){
    if (getInside){
        this.state = "INSIDE ELEVATOR";
        this.isInside = true;
    }
    else{
        this.state = "IDLE";
    }
}
  setOutsideState(getOutside){
    if (getOutside){
            this.state = "OUTSIDE ELEVATOR";
            this.isInside = false;
        }
        else{
            this.state = "IDLE";
        }
  }

  async moveTo(destination, getInside, getOutside){
    return new Promise((resolve, reject) => {
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
        function animateRight(timestamp) {
            if (!startTime) startTime = timestamp;

            var progress = timestamp - startTime;
            var elapsedTime = progress;
            newPosition = startPosition + speed * elapsedTime;
            entityVisual.style.left = newPosition + 'px';

            if ( Math.abs(newPosition - destination) < 5){

                    self.setInsideState(getInside)
                    self.setOutsideState(getOutside)
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
                self.setInsideState(getInside)
                self.setOutsideState(getOutside)
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


    async callElevator(){
        return new Promise((resolve, reject) => {
            createExternalRequest("DOWN",this.currentFloor);
            this.state = "WAITING";
            const intervalId2 = setInterval(() => {

                            if (this.state == "GETTING IN") {
                                clearInterval(intervalId2);
                                console.log("Elevator has arrived!");
                                resolve();
                            }
                        }, 500);

        });
    }


    async makeElevatorRequest(){
        return new Promise((resolve, reject) => {

            createInternalRequest(this.desiredFloor);
            const elev = document.getElementById("elevator");
            const entityVisual = document.getElementById(this.htmlId);
            entityVisual.style.left = parseInt(entityVisual.style.left) - 100 + "px";
            elev.appendChild(entityVisual);
            this.state = "TRAVELLING";
            const intervalId3 = setInterval(() => {
                            if (this.state == "GETTING OUT") {
                                clearInterval(intervalId3);
                                console.log("Arrived at floor!");
                                this.travelComplete = true;
                                const floor = document.getElementById("floor" + this.desiredFloor);
                                floor.appendChild(entityVisual)
                                entityVisual.style.left = parseInt(entityVisual.style.left) + 100 + "px";
                                resolve();
                            }
                        }, 500);

        });

    }

    displayPosition(){
        console.log("The left position is: " + this.drawing.left)
        console.log("state? " + this.state)
        console.log("floor? " + this.currentFloor)
        console.log("is inside? " + this.isInside)
        console.log("travel complete? " + this.travelComplete)
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

    drawEntity(floorId){
        const objectVisual = document.createElement('div');
        const floorVisual = document.getElementById(floorId);
        objectVisual.setAttribute('class', 'entityVisual');
        objectVisual.setAttribute('id', this.htmlId);


        objectVisual.style.height = sizer.calculateObjectSize(this)[1] + "px";
        objectVisual.style.width = sizer.calculateObjectSize(this)[0] + "px";
        objectVisual.style.left = sizer.calculateObjectPosition(this) + "px";
        objectVisual.style.bottom = "0px";
        floorVisual.appendChild(objectVisual);



      }

      stateWatcher(){

        if (this.state != this.oldState) {
            console.log("State change for entityID: " + this.htmlId);
            console.log("State change from: " + this.oldState  + " to: " + this.state);
            this.oldState = this.state;
        }

      }

}


