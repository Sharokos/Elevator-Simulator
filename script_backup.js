
const thisElevator = new Elevator(10,0,"False","False");
var element = document.getElementById('elevator');
var durationPerFloor = 1000;
var callQueue = new Queue();

function moveElevator(floor) {
	return new Promise((resolve, reject) => {
		var startPosition = parseInt(element.style.bottom);
		var currFloor = thisElevator.getFloor();
		console.log("Current floor" + currFloor)
		console.log("Requseted floor" + floor)
		var startTime = null;
		var direction = "UP";
		var floorDistance = 0;
		if (currFloor > floor){
			floorDistance = currFloor - floor;
			direction = "DOWN";
		}
		else {
			floorDistance = floor - currFloor;
		}
		var distance = floorDistance * 100;
		var duration = floorDistance * durationPerFloor;
		console.log("Direction is: " + direction )
		console.log("Distance is: " + distance )
		thisElevator.moveToFloor(floor);
		setTimeout(() => {        
            resolve();
        }, duration + 500); // Simulating a 2-second delay		
		function animateUp(timestamp) {
			if (!startTime) startTime = timestamp;
			var progress = timestamp - startTime;
			var elapsedTime = Math.min(progress, duration);
			var newPosition = startPosition + (distance / duration) * elapsedTime; 
			element.style.bottom = newPosition + 'px';

			if (progress < duration) {
				requestAnimationFrame(animateUp);
			}
		}    
		function animateDown(timestamp) {
			if (!startTime) startTime = timestamp;
			var progress = timestamp - startTime;
			var elapsedTime = Math.min(progress, duration); 
			var newPosition = startPosition - (distance / duration) * elapsedTime; 
			element.style.bottom = newPosition + 'px';

			if (progress < duration) { 
				requestAnimationFrame(animateDown);
			}
		}
		if (direction == "UP"){
			requestAnimationFrame(animateUp);
		} else{
			requestAnimationFrame(animateDown);
		}

		
    });
}

function processCalls(){ 

    if (callQueue.isEmpty()) {
        return Promise.resolve();
    }

    // Process the next element of the queue
    var call = callQueue.dequeue(); // Remove the first element from the queue
    return moveElevator(call.destinationFloor)
        .then(() => {
            // Recursively process the rest of the queue
            return processCalls();
        });
}

function displayFloor(){
	console.log(`Current floor is: ${thisElevator.getFloor()}`)
}

function createExternalRequest(direction){
	const dropdown = document.getElementById("numberDropdown");
	var floor = parseInt(dropdown.value);
	var eReq = new Request(0, floor, direction);
	callQueue.enqueue(eReq);
}

function createInternalRequest(destination){
	var currFloor = thisElevator.getFloor();
	var direction = "UP";
	if (destination < currFloor){
		direction = "DOWN";
	}
	var iReq = new Request(currFloor, destination, direction);
	callQueue.enqueue(iReq);
}


function displayRequestCalls(){
	console.log(callQueue.printQueue());
}



