
class Request {
	static nextId = 1000;
  constructor(requestFloor, destinationFloor, direction) {
	this.id = Request.nextId++;
    this.requestFloor = requestFloor;
    this.destinationFloor = destinationFloor;
    this.direction = direction;
  }
}


