class Request {
	static nextId = 1000;
  constructor(requestFloor,desiredDirection, type, callerId) {
	this.id = Request.nextId++;
	this.callerId = callerId;
    this.requestFloor = requestFloor;
    this.desiredDirection = desiredDirection;
    this.type = type;
    this.done = false;

  }
}


