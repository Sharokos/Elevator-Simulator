class Queue {
  constructor() {
    this.items = [];
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

  // Return the first element from the queue without removing it
  front() {
    if (this.isEmpty()) {
      return "No elements in Queue";
    }
    return this.items[0];
  }

  updateCallQueue(currentFloor, movingDirection, newCall){  

	var updated = false;

	if(this.size() >= 1){
//	    console.log("New call destination: " + newCall.destinationFloor)
//        	console.log("Current Floor: " + currentFloor)
//        	console.log("Old priority call destination: " + this.items[0].destinationFloor)
        if ((newCall.destinationFloor > currentFloor && newCall.destinationFloor < this.items[0].destinationFloor)){
            console.log("Condition true")
            console.log("NewCall direction:")
            console.log(newCall.direction)
            console.log("Wanted:")
            console.log(newCall.wantedDirection)
            console.log("Moving:")
            console.log(movingDirection)

        }
		if ((newCall.destinationFloor > currentFloor && newCall.destinationFloor < this.items[0].destinationFloor)||
		(newCall.destinationFloor < currentFloor && newCall.destinationFloor > this.items[0].destinationFloor)){
		  if (newCall.direction == movingDirection || newCall.wantedDirection == movingDirection){
		    console.log("Updating queue")
			this.items.splice(0,0,newCall);  
			updated = true;
		  }
		}  
	}
		  
	return updated; 
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
	  + " " + this.items[i].direction + "\n";
    }
    return str;
  }
  
  
  findIndexOfElement(element){
	  
	  
	for (let i = 0; i< this.size(); i++){
		
			console.log(this.items[i].id);
			if (element.id == this.items[i].id){
				console.log("Found");
				return i;
				
			}
		}
	}
}