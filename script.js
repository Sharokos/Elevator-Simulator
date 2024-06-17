
const thisElevator = new Elevator(10,0,false,false,"UP", 0);
var elevator = document.getElementById('elevator');
var durationPerFloor = 1000;
var callQueue = new Queue();
let intervalId;


const canvas = document.getElementById('scene');

function addMeasurementUnit(parameter, unit){
	return parameter + unit
}

function resizeScene() {
	dimensionsArray = getWindowDimensions()
	// 0 index = width, 1 index = height
	width = dimensionsArray[0]
	pxWidth = addMeasurementUnit(width, "px")
	height = dimensionsArray[1]
	pxHeight = addMeasurementUnit(height, "px")
	resizeFrame(pxWidth, pxHeight)
	calculateSizes(width, height)
	const line = document.getElementById('floor')
	line.style.bottom = "100px"
	
}

function getWindowDimensions(){
	const aspectRatio = 16 / 9;
	
	const width = document.documentElement.clientWidth - 50
	const height = document.documentElement.clientHeight - 50	
	
	var returnWidth = width;
	var returnHeight = height;
	if (width / height < aspectRatio) {
		returnHeight = width / aspectRatio
	} else {
		returnWidth = height * aspectRatio 		
	}	
	return [returnWidth, returnHeight]
}
function resizeFrame(pxWidth, pxHeight) {
		canvas.style.width = pxWidth;		
		canvas.style.height = pxHeight;
}


function calculateSizes(width, height) {
	elevatorWidth = width / 15
	ratio = 1.5
	elevatorHeight = elevatorWidth * ratio
	elevatorWidthPx = addMeasurementUnit(elevatorWidth, "px")
	elevatorHeightPx = addMeasurementUnit(elevatorHeight, "px")
	bottomLevel = height - elevatorHeight
	bottomLevel = addMeasurementUnit(-bottomLevel, "px")
	elevator.style.width = elevatorWidthPx
	elevator.style.height = elevatorHeightPx
	elevator.style.bottom = bottomLevel
}


window.addEventListener('resize', resizeScene);
resizeScene(); // Initial call
function moveElevator(direction) {
	
	if(thisElevator.getFloor() == thisElevator.getNextFloor()) {
		console.log("Floor reached. Will stop")
		callQueue.dequeue();
		clearInterval(intervalId);
		
		return;
		}		
	if (!thisElevator.isMoving){
		console.log("Is not moving. Will move with direction = " + direction)
		thisElevator.isMoving = true;
		var startPosition = parseInt(elevator.style.bottom);
		var currFloor = thisElevator.getFloor();
		
		var startTime = null;
		
		var distance = 100;
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
				thisElevator.isMoving = false;
				thisElevator.moveToFloor(currFloor + 1);
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
				thisElevator.isMoving = false;
				thisElevator.moveToFloor(currFloor - 1);
			}
		}
		
		
		if (direction == "UP"){
			console.log("Will move up");
			requestAnimationFrame(animateUp);
		} else{
			console.log("Will move down.")
			requestAnimationFrame(animateDown);
		}
	}
}

function startElevator(direction){
	intervalId = setInterval(moveElevator, 100, direction);
}
function updateNextFloor(){
	var nextFloor;
	var direction;
	if (!callQueue.isEmpty()){
		nextFloor = callQueue.front().destinationFloor;
		direction = callQueue.front().direction;
	} else {
		nextFloor = thisElevator.getFloor();
		direction = "UNKNOWN";
		
	}
	thisElevator.setNextFloor(nextFloor);
	thisElevator.setDirection(direction);	
}
function initialize(){
	updateNextFloor();
	if(!callQueue.isEmpty()){
		console.log(callQueue.size())
		if(!thisElevator.isMoving){
			console.log("Started with direction " + thisElevator.getDirection())
			startElevator(thisElevator.getDirection());
		}
	}
}
intervalId2 = setInterval(initialize, 1000);

function displayElevatorState(){
	console.log(`Elevator current floor is: ${thisElevator.getFloor()}` )
	console.log(`Elevator next floor is: ${thisElevator.getNextFloor()}` )
	console.log(`Elevator direction is: ${thisElevator.getDirection()}` )
	console.log(`Is elevator moving: ${thisElevator.isMoving}` )
}

function test(){
	
	var req = callQueue.elementAt(3);
	console.log(req.direction);
	callQueue.findIndexOfElement(req);
}
function createExternalRequest(direction){
	const dropdown = document.getElementById("numberDropdown");
	var floor = parseInt(dropdown.value);
	var eReq = new Request(0, floor, direction);
	if (!callQueue.updateCallQueue(thisElevator.getFloor(), thisElevator.getDirection(), eReq)){
		callQueue.enqueue(eReq);
	}
	
}

function createInternalRequest(destination){
	var currFloor = thisElevator.getFloor();
	var direction = "UP";
	if (destination < currFloor){
		direction = "DOWN";
	}
	var iReq = new Request(currFloor, destination, direction);
	if (!callQueue.updateCallQueue(thisElevator.getFloor(), thisElevator.getDirection(), iReq)){
		callQueue.enqueue(iReq);
	}
}


function displayRequestCalls(){
	console.log(callQueue.printQueue());
}



