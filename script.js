const sizer = new SizeCalculator();
const rand = new Randomness();
const scenario = new Scenarios();
const history = [];
var numberOfFloors = rand.getRandomInt(4, 8);
const thisElevator = new Elevator(numberOfFloors,0,false,false,"UP", 0);
const floors = Floor.generateFloors(numberOfFloors);
var entities = []



function displayFloors(){
for (floor of floors){
    console.log(floor.display())
}
}


function moveToElevator1(){
    scenario.moveToElevator(entities[0])

}
function moveToElevator2(){
    scenario.moveToElevator(entities[1])

}





function displayEntities(){
    for (var ent of entities){
        ent.displayPosition();
    }
}



const initializer = new InitializeScene(sizer, rand);



var durationPerFloor = 1000;
var callQueue = new Queue();
var historyQueue = new Queue();
let intervalId;


const canvas = document.getElementById('scene');


function scrollToBottom(elementId) {
    var element = document.getElementById(elementId);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}


function resizeScene() {

	sizer.resizeFrame(canvas);
	sizer.resizeElevator();
	sizer.resizeFloors(floors);
//	for (var floor of floors){
//	    sizer.redrawObjects(floor.objects)
//	}
}





window.addEventListener('resize', resizeScene);

initializer.init(floors); // Initial call
scrollToBottom('scene');
var elevator = document.getElementById('elevator');

function moveElevator(direction) {

	if(thisElevator.getFloor() == thisElevator.getNextFloor()) {
		console.log(`Floor ${thisElevator.getFloor()} reached. Will stop`)
		if (callQueue.front().type == "internal"){
		    thisElevator.internalRequest = false;
		}
		callQueue.dequeue();


		clearInterval(intervalId);

		return;
		}
	if (!thisElevator.isMoving){
		//console.log("Is not moving. Will move with direction = " + direction)
		thisElevator.isMoving = true;

		var startPosition = parseInt(elevator.style.bottom);
		var currFloor = thisElevator.getFloor();

		var startTime = null;

		var distance = sizer.calculateFloorHeight();
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
			//console.log("Will move up");
			requestAnimationFrame(animateUp);

		} else{
			//console.log("Will move down.")
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

function checkIfEntitiesAreWaiting(enties){
    for (var e in enties){
        if (e.state=="WAITING"){
            return true;
        }
    }
    return false;
}
function checkIfEntitiesAreGettingOut(enties){
    for (var e in enties){
        if (e.state=="GETTING OUT"){
            return true;
        }
    }
    return false;
}

function checkWaitingEntities(){
    var enties = Entity.getEntitiesForFloor(thisElevator.currentFloor);
    if (checkIfEntitiesAreWaiting(enties)) {return true;}
    else {return false;}
}
function checkGettingOutEntities(){
    var enties = Entity.getEntitiesForFloor(thisElevator.currentFloor);
    if (checkIfEntitiesAreGettingOut(enties)) {return true;}
    else {return false;}
}

function spawnEntity(){
    const dropdown = document.getElementById("numberDropdown");
    var floorNumber = parseInt(dropdown.value);
    var desire = rand.getRandomInt(0, 4);
    const entity = Entity.generateEntity(rand,floorNumber,desire)
    entity.drawEntity("floor" + floorNumber)
    entities.push(entity);

}

function checkIfElevatorIsEmpty(){

    for (var entity of entities){
        if (entity.isInside){
            thisElevator.isOccupied = true;
            return;
        }
    }
    thisElevator.isOccupied = false;
}

// DE AICI SE POATE JONGLA CU DECIZIA DE PLECARE A LIFTULUI - poti adauga oricate functii pe care sa le verifici inainte sa plece
function initialize(){
    checkIfElevatorIsEmpty();

	if(!callQueue.isEmpty()){
		//console.log(callQueue.size())
        updateNextFloor();

		if(!thisElevator.isMoving){
		    if(!checkWaitingEntities() && !checkGettingOutEntities() ){
		        if(thisElevator.isOccupied){
		            if(callQueue.front().type == "internal"){
			            //console.log("Started with direction " + thisElevator.getDirection())
			            startElevator(thisElevator.getDirection());
			        }
			    }
			    else{
			        if(callQueue.front().type == "external"){
                        startElevator(thisElevator.getDirection());
                    }
			    }
			}
		}
	}
}
intervalId2 = setInterval(initialize, 1000);

function displayElevatorState(){
	console.log(`Elevator current floor is: ${thisElevator.getFloor()}` )
	console.log(`Elevator next floor is: ${thisElevator.getNextFloor()}` )
	console.log(`Elevator direction is: ${thisElevator.getDirection()}` )
	console.log(`Is elevator moving: ${thisElevator.isMoving}` )
	console.log(`Is elevator occupied: ${thisElevator.isOccupied}` )
}


function createExternalRequest(wantedDirection, callFloor){
	var currFloor = thisElevator.getFloor();
	var nextFloor = thisElevator.getNextFloor();
	var direction = "UP";
	if (callFloor < currFloor){
	    direction = "DOWN";
	}
	if (callFloor < nextFloor){
	    direction = "DOWN";
	}
	else {
	    direction = "UP";
	}
	var eReq = new Request(callFloor, callFloor, direction,wantedDirection, "external");
	historyQueue.enqueue(eReq);
	if (!callQueue.updateCallQueue(thisElevator.getFloor(), thisElevator.getDirection(), eReq)){
		callQueue.enqueue(eReq);
	}
	
}

function createInternalRequest(destination){
	var currFloor = thisElevator.getFloor();
	var nextFloor = thisElevator.getNextFloor();

	var direction = "UP";
	if (destination < currFloor){
		direction = "DOWN";
	}
	if (currFloor == destination){
	    if (destination < nextFloor){
	    direction = "DOWN";
	    }
	}
	thisElevator.internalRequest = true;
	var iReq = new Request(currFloor, destination, direction, direction, "internal");
	historyQueue.enqueue(iReq);
	if (!callQueue.updateCallQueue(thisElevator.getFloor(), thisElevator.getDirection(), iReq)){
		callQueue.enqueue(iReq);
	}
}


function displayRequestCalls(){
	console.log(callQueue.printQueue());
}



