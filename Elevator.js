
class Elevator {
  constructor(numberOfFloors, currentFloor, isMoving, areDoorsOpen, movingDirection, nextFloor) {
    this.numberOfFloors = numberOfFloors;
    this.currentFloor = currentFloor;
    this.isMoving = isMoving;
    this.areDoorsOpen = areDoorsOpen;
	this.movingDirection = movingDirection;
	this.nextFloor = nextFloor;
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
		
		console.log(`Moving from ${this.currentFloor} to ${floor}!`);
		this.setFloor(floor);
  }
}


