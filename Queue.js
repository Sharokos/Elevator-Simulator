class Queue {
  constructor() {
    this.items = [];
    this.updating = false;
    this.oldSize = 0;
  }

  // Add element to the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Remove and return the first element from the queue
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }

  removeItem(item){
    if (this.isEmpty()) {
          return "Underflow";
    }
    if (this.checkSize()){
        const index = this.findIndexOfElement(item);
//        console.log("BEFORE")
//
//        console.log(this.printQueue());
        this.items.splice(index, 1);
//        console.log(index);
//        console.log("AFTER")
//        console.log(this.printQueue());
    }
    else{
//        console.log("Can't remove because updating.")
    }
  }

  // Return the first element from the queue without removing it
  front() {
    if (this.isEmpty()) {
      return "No elements in Queue";
    }
    return this.items[0];
  }

  updateCallQueue(currentFloor, movingDirection, newCall){  
    this.updating = false;
	var updated = false;
//    console.log("Checking for element:" + newCall.id)
//    console.log("Destination:" + newCall.destinationFloor)
//    console.log("Direction:" + newCall.direction)
//    console.log("Type:" + newCall.type)
	if(this.size() >= 1){
//	    console.log("New call destination: " + newCall.destinationFloor)
//        	console.log("Current Floor: " + currentFloor)
//        	console.log("Old priority call destination: " + this.items[0].destinationFloor)
//        if ((newCall.destinationFloor > currentFloor && newCall.destinationFloor < this.items[0].destinationFloor)){
//            console.log("Condition true")
//            console.log("NewCall direction:")
//            console.log(newCall.direction)
//            console.log("Wanted:")
//            console.log(newCall.wantedDirection)
//            console.log("Moving:")
//            console.log(movingDirection)
//
//        }
		if ((newCall.destinationFloor > currentFloor && newCall.destinationFloor < this.items[0].destinationFloor)||
		(newCall.destinationFloor < currentFloor && newCall.destinationFloor > this.items[0].destinationFloor)){
		  if (newCall.direction == movingDirection || newCall.wantedDirection == movingDirection){
//		    console.log("Updating queue")
			this.items.splice(0,0,newCall);  
			updated = true;
			this.updating = true;

		  }
		}
		  else if(newCall.type == "internal"){
//		    console.log("Updating queue")
            this.items.splice(0,0,newCall);
            updated = true;
            this.updating = true;
		}

	}
		  
	return updated; 
  }
  checkSize(){
    if (this.oldSize != this.size()){
        this.oldSize = this.size();
        return false;

    }
    return true;
  }
  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the size of the queue
  size() {
    return this.items.length;
  }
  
  addBeforeIndex(element1, element2){
	  
	  var index = this.items.indexOf(element2);
	  if (index != -1){
		this.items.splice(index, 0, element1);
	  }
  }
  // Print the queue elements
  printQueue() {
    let str = "";
    for (let i = 0; i < this.items.length; i++) {
	
      str += "Call#" + i + " " + this.items[i].id + " " + this.items[i].requestFloor + " " 
	  + this.items[i].destinationFloor 
	  + " " + this.items[i].direction
	  + " CALLER " + this.items[i].callerId
	  + " " + this.items[i].type + "\n";
    }
    return str;
  }
  
  
  findIndexOfElement(element){
	  
	  
	for (let i = 0; i< this.size(); i++){
		

			if (element.id == this.items[i].id){

				return i;
				
			}
		}
	}
}