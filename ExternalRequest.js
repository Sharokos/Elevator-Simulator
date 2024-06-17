
class ExternalRequest {
	static nextId = 5000;
  constructor(requestFloor, direction) {
	this.id = ExternalRequest.nextId++;
    this.requestFloor = requestFloor;
    this.direction = direction;
  }
}


