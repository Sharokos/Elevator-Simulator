
class Elevator {
  constructor(numberOfFloors, currentFloor, isMoving, areDoorsOpen, movingDirection, nextFloor) {
    this.numberOfFloors = numberOfFloors;
    this.currentFloor = currentFloor;
    this.isMoving = isMoving;
    this.areDoorsOpen = areDoorsOpen;
	this.movingDirection = movingDirection;
	this.nextFloor = nextFloor;
	this.isOccupied = false;
	this.internalRequest = false;
	this.isAtDestination = false;
  }
	




	getFloor(){
		return this.currentFloor;
	}	
	getNextFloor(){
		return this.nextFloor;
	}		
	getDirection(){
		return this.movingDirection;
	}	
	setFloor(floor){
		this.currentFloor = floor;
	}	
	setNextFloor(nextFloor){
		this.nextFloor = nextFloor;
	}
	setDirection(movingDirection){
		this.movingDirection = movingDirection;
	}
	moveToFloor(floor) {
		
		//console.log(`Moving from ${this.currentFloor} to ${floor}!`);
		this.setFloor(floor);
  }

  computeDirection(){
    return (this.currentFloor > this.nextFloor) ? this.direction = "DOWN" : this.direction = "UP";

  }
  updateNextFloor(){
  	var nextFloor;
  	var direction;
  	if (!callQueue.isEmpty()){
  		nextFloor = callQueue.front().destinationFloor;

  	} else {
  		nextFloor = this.getFloor();
  		direction = "UNKNOWN";

  	}
  	this.setNextFloor(nextFloor);

  }
      moveElevator() {

        var direction = this.computeDirection();
    	if(this.getFloor() == this.getNextFloor()) {
    		console.log(`Floor ${this.getFloor()} reached. Will stop`)
    		if (callQueue.front().type == "internal"){
    		    this.internalRequest = false;
    		}



    		clearInterval(intervalId);

    		return;
    		}
    	const self = this;
    	if (!this.isMoving){
    		//console.log("Is not moving. Will move with direction = " + direction)
    		this.isMoving = true;

    		var startPosition = parseInt(elevator.style.bottom);
    		var currFloor = this.getFloor();

    		var startTime = null;

    		var distance = sizer.calculateFloorHeight();
    		var duration = durationPerFloor;



    		function animateUp(timestamp) {
    			if (!startTime) startTime = timestamp;

    			var progress = timestamp - startTime;
    			var elapsedTime = Math.min(progress, duration);
    			var newPosition = startPosition + (distance / duration) * elapsedTime;
    			elevator.style.bottom = newPosition + 'px';

    			if (progress < duration) {
    				requestAnimationFrame(animateUp);
    			}
    			else{
    				self.isMoving = false;
    				self.isAtDestination = true;
    				self.moveToFloor(currFloor + 1);
    			}
    		}
    		function animateDown(timestamp) {
    			if (!startTime) startTime = timestamp;

    			var progress = timestamp - startTime;
    			var elapsedTime = Math.min(progress, duration);
    			var newPosition = startPosition - (distance / duration) * elapsedTime;
    			elevator.style.bottom = newPosition + 'px';

    			if (progress < duration) {
    				requestAnimationFrame(animateDown);
    			}
    			else{
    				self.isMoving = false;
    				self.isAtDestination = true;
    				self.moveToFloor(currFloor - 1);
    			}
    		}

            direction = this.computeDirection();
    		if (direction == "UP"){
    			//console.log("Will move up");
    			requestAnimationFrame(animateUp);

    		} else{
    			//console.log("Will move down.")
    			requestAnimationFrame(animateDown);


    		}
    	}
    }

}


