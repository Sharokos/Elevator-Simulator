const sizer = new SizeCalculator();
const rand = new Randomness();
const scenario = new Scenarios();
const history = [];
var numberOfFloors = rand.getRandomInt(4, 8);
const thisElevator = new Elevator(numberOfFloors,0,false,true,"UP", 0);
const floors = Floor.generateFloors(numberOfFloors);
var entities = []

// TODO: Add decision functions for starting the elevator (waiting entities/getting in/out...)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function displayFloors(){
    for (floor of floors){
        console.log(floor.display())
    }
}


async function moveToElevator(){
    for (var entity of entities){
        scenario.moveToElevator(entity)
        await delay(5000);

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
const elevator = document.getElementById('elevator');


async function startElevator(){

    thisElevator.moveElevator();

}


function areEntitiesLeftOutside(enties){
    for (var e of enties){

        if ((e.state == "GETTING IN") && (e.state == "WAITING")){

            return true;
        }
    }
    return false;
}
function checkIfEntitiesAreGettingOut(enties){
    for (var e of enties){
        if ((e.state=="GETTING OUT") || (e.state=="OUTSIDE ELEVATOR")){

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




// DE AICI SE POATE JONGLA CU DECIZIA DE PLECARE A LIFTULUI - poti adauga oricate functii pe care sa le verifici inainte sa plece
async function initialize(){

//    checkIfElevatorIsEmpty();
//    clearQueue();
	if(!callQueue.isEmpty()){
		if(!thisElevator.isBusy){

            startElevator();
        }
    }
}
intervalId2 = setInterval(initialize, 100);

function displayElevatorState(){
	console.log(`Elevator current floor is: ${thisElevator.currentFloor}` )

	console.log(`Elevator direction is: ${thisElevator.movingDirection}` )
	console.log(`Doors: ${thisElevator.areDoorsOpen}` )
	console.log(`Is elevator moving: ${thisElevator.isMoving}` )
	console.log(`Is elevator occupied: ${thisElevator.isOccupied}` )
	console.log(`Is elevator at destination: ${thisElevator.isAtDestination}` )


}



function createExternalRequest(floor, direction){
	var call = new Request(floor, direction, "external", "id");
	callQueue.addNewCall(call);


}

function createInternalRequest(floor){
	var call = new Request(floor,  "UP", "internal", "id");
	callQueue.addNewCall(call);

}



function displayRequestCalls(){
	console.log(callQueue.printQueue());
}



