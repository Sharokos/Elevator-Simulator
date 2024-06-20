const sizer = new SizeCalculator();
const rand = new Randomness();
const scenario = new Scenarios();
const history = [];
var numberOfFloors = rand.getRandomInt(4, 8);
const thisElevator = new Elevator(numberOfFloors,0,false,false,"UP", 0);
const floors = Floor.generateFloors(numberOfFloors);
var entities = []


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function displayFloors(){
    for (floor of floors){
        console.log(floor.display())
    }
}


function moveToElevator(){
    for (var entity of entities){
        scenario.moveToElevator(entity)
        delay(5000);
    }

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


function startElevator(direction){
    console.log("Starting elevator.")
//	intervalId = setInterval(thisElevator.moveElevator.bind(thisElevator), 100);
    thisElevator.moveElevator();

}


function areEntitiesLeftOutside(enties){
    for (var e of enties){

        if ((e.state !== "INSIDE ELEVATOR") && (e.state !== "MOVING")){
            console.log(e.htmlId + " is waiting.")

            return true;
        }
    }
    return false;
}
function checkIfEntitiesAreGettingOut(enties){
    for (var e of enties){
        if (e.state=="GETTING OUT"){
            console.log(e.htmlId + " is getting out.")
            return true;
        }
    }
    return false;
}

function checkOutsideEntities(){
    var enties = Entity.getEntitiesForFloor(thisElevator.currentFloor);

    if (areEntitiesLeftOutside(enties)) {return true;}
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
    var desire = 0
    do {
       desire = rand.getRandomInt(0, 4)
    } while (desire == floorNumber);
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


function clearQueue(){
    //console.log(callQueue.printQueue())
    for (var req of callQueue.items){
        var entity = Entity.getEntityById(req.callerId);

        if ((entity.state == "GETTING IN") || (entity.state == "TRAVELLING")){

            if (req.type == "external"){
//                console.log("external")
                callQueue.removeItem(req);
            }
        }
        if ((entity.state == "GETTING OUT") || (entity.state == "MOVING")){
            console.log("getting out sau moving")
            if (req.type == "internal"){
//                console.log("internal")
                callQueue.removeItem(req);
            }
        }

    }
}

// DE AICI SE POATE JONGLA CU DECIZIA DE PLECARE A LIFTULUI - poti adauga oricate functii pe care sa le verifici inainte sa plece
function initialize(){
    checkIfElevatorIsEmpty();
    clearQueue();
	if(!callQueue.isEmpty()){
		//console.log(callQueue.size())

        thisElevator.updateNextFloor();

		if(!thisElevator.isMoving){
//		    console.log("Not moving.")
		    if(!checkOutsideEntities() && !checkGettingOutEntities() ){
//		        console.log("No one waiting.")

		        if(thisElevator.isOccupied){

		            if(callQueue.front().type == "internal"){
//		                console.log("Occupied and Internal")
			            //console.log("Started with direction " + thisElevator.getDirection())
			            startElevator(thisElevator.getDirection());
			        }
			        else{

			            console.log("Not starting because elevator is occupied, but the next call is external.")
			        }
			    }
			    else{
			        if(callQueue.front().type == "external"){
//			            console.log("Empty and external.")
                        startElevator(thisElevator.getDirection());
                    }
                    else{
                        console.log("Not starting because elevator is empty, but the next call is internal.")
                    }
			    }
			}
			else{
                console.log("Not starting because entities are waiting or getting out.")
			}
		}
		else{
		    //console.log("Not starting because elevator is already moving.")
		}
	}
	else{
	    //console.log("Not starting because queue is empty.")
	}
}
intervalId2 = setInterval(initialize, 100);

function displayElevatorState(){
	console.log(`Elevator current floor is: ${thisElevator.getFloor()}` )
	console.log(`Elevator next floor is: ${thisElevator.getNextFloor()}` )
	console.log(`Elevator direction is: ${thisElevator.getDirection()}` )
	console.log(`Is elevator moving: ${thisElevator.isMoving}` )
	console.log(`Is elevator occupied: ${thisElevator.isOccupied}` )
}


function createExternalRequest(wantedDirection, callFloor, callerId){
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
	var eReq = new Request(callFloor, callFloor, direction,wantedDirection, "external", callerId);
	historyQueue.enqueue(eReq);
	if (!callQueue.updateCallQueue(thisElevator.getFloor(), thisElevator.getDirection(), eReq)){
		callQueue.enqueue(eReq);
	}
	
}

function createInternalRequest(destination, callerId){
//    console.log("INTERNAL AT: " + Date.now())
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
	var iReq = new Request(currFloor, destination, direction, direction, "internal", callerId);
	historyQueue.enqueue(iReq);
	if (!callQueue.updateCallQueue(thisElevator.getFloor(), thisElevator.getDirection(), iReq)){
		callQueue.enqueue(iReq);
	}
}


function displayRequestCalls(){
	console.log(callQueue.printQueue());
}



