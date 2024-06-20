
class Request {
	static nextId = 1000;
  constructor(requestFloor, destinationFloor, direction, wantedDirection, type, callerId) {
	this.id = Request.nextId++;
	this.callerId = callerId;
    this.requestFloor = requestFloor;
    this.destinationFloor = destinationFloor;
    this.direction = direction;
    this.wantedDirection = wantedDirection;
    this.type = type;
  }
}


