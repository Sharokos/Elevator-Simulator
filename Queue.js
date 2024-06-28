class Queue {
  constructor() {
    this.items = [];
	this.currentFloor = 0; //Mock-up to simulate elevator
	this.elevatorDir = "UP"; //Mock-up to simulate elevator

	this.isBusy = false;
  }

	isInternalCallInQ(){

		for (var item of this.items){
			if (item.type == "internal"){
				return true;
			}
		}
		return false;

	}

	isCallOnTheWay(call){
		if (this.elevatorDir == "UP"){
			if((call.requestFloor < this.front().requestFloor) && (call.requestFloor > this.currentFloor)){
				return true;
			}
			else{ return false; }
		}
		else{
			if((call.requestFloor > this.front().requestFloor) && (call.requestFloor < this.currentFloor)){ // to add also the check for currentFloor when implementing elevator
				return true;
			}
			else{ return false; }
		}
	}

    // List of corner cases - TODO
	// I2 E1D I3 ?
	addNewCall(call){
		if (!this.isEmpty()){
			if (this.isInternalCallInQ()){
			    console.debug("Internal call existing in Q.")
				if (call.type == "internal"){
				    console.debug("Current call is internal.")
					if (this.isCallOnTheWay(call)){
					    console.debug("Current call is on the way - prioritize.")
						this.firstInQueue(call);

					}
					else{
                        console.debug("Current call is NOT on the way - adding before any external.")

                        this.enqueueInternal(call);
					}

				}
				else {
				    console.debug("Current call is external.")
					if (call.desiredDirection == this.elevatorDir){
					    console.debug("Current call is in the same direction. - prioritize")
						this.firstInQueue(call);
					}
					else{
					    console.debug("Current call is not in the same direction.")
					    this.enqueue(call);

					}
				}

			}
			else {
			    console.debug("No other internals.")
				if (call.type == "internal"){
				    console.debug("Current call is internal. - prioritize")
					this.firstInQueue(call);
				}
				else{
				    console.debug("Current call is external.")
					if (call.desiredDirection == this.elevatorDir){
					    console.debug("Current call is in the same direction. - prioritize")
						this.firstInQueue(call);
					}
					else{
					    this.enqueue(call);
					    console.debug("Current call is not in the same direction.")
					}
				}

			}
		}
		else{
		    console.debug("Q is empty - adding")
			this.enqueue(call);
		}



	}


	enqueue(element) {
		this.items.push(element);
	}


	dequeue() {
		if (this.isEmpty()) {
			return "Underflow";
		}
			console.log("DEQUEUE")
			this.items.shift();

	}


	// Return the first element from the queue without removing it
	front() {
		if (this.isEmpty()) {
		  return "No elements in Queue";
		}
			return this.items[0];
	}


	getFirstExternalInQueue(){

		for (var call of this.items){

			if (call.type == "external"){
				return call;
			}
		}

	}
	enqueueInternal(call){
		var firstExternal = this.getFirstExternalInQueue();
        if (firstExternal){
		    this.addBeforeIndex(call, firstExternal);
		}
		else{
		    this.enqueue(call);
		}
	}

	isEmpty() {
		return this.items.length === 0;
	}


	size() {
		return this.items.length;
	}

	firstInQueue(call){
		this.addBeforeIndex(call, this.front())
	}

	addBeforeIndex(element1, element2){

	  var index = this.items.indexOf(element2);
	  if (index != -1){
		this.items.splice(index, 0, element1);
	  }
	}


}
