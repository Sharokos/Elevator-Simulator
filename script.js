const sizer = new SizeCalculator();
const rand = new Randomness();

const history = [];
var numberOfFloors = rand.getRandomInt(4, 8);
const thisElevator = new Elevator(numberOfFloors,0,false,true,"UP", 0);

const elevatorSpawnPosition = 200;
const elevatorBtnsPosition = (sizer.getWidth()/80)*6;
const absoluteBtnsPosition = elevatorBtnsPosition + elevatorSpawnPosition;
const floors = Floor.generateFloors(numberOfFloors);
// TODO: randomize position inside elevator
// TODO: start looking into generating correct objects (lamps/mugs/small plants on top of desks) - static entities? (receptioneri care sa faca zambre)
// TODO: start looking into how to draw the actual 8bit art (random ideas: emergency exit signs would be cool... display deasupra liftului care arata la ce etaj e si ce directie are liftul)
// TODO: Un div prezent mereu peste lift dar invizibil si devine vizibil doar cand se inchid/deschid usile. Cand sunt inchise e imagine, in rest e gif, iar cand sunt deschise e invizibil
// TODO: Un div prezent la fiecare etaj pe full height si pe latimea liftului (z-index sub lift, dar peste perete) - casa liftului
// TODO: O clasa separata care sa tina toate variabilele globale? poate! (customizata pt fiecare theme)
// TODO: O clasa NoNonsense rules careia sa ii feed in un obiect si sa verifice daca e ok in contextul etajului sau ba.




window.addEventListener('keydown', (event) => {
      switch (event.key) {
          case 'ArrowUp':

              break;
          case 'ArrowDown':

              break;
          case 'ArrowLeft':
              player.moveLeft();
              break;
          case 'ArrowRight':
              player.moveRight();
              break;
      }
  });
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function displayFloors(){
    for (floor of floors){
        console.debug(floor.display())
    }
}


async function moveToElevator(){
    for (var entity of Entity.entityList){
        var scenario = new Scenarios(entity);
        scenario.moveToElevator()
        await delay(2000);
    }

}





function displayEntities(){
    for (var ent of Entity.entityList){
        ent.displayPosition();
    }
}






const initializer = new InitializeScene(sizer, rand);



var durationPerFloor = 1000;
var callQueue = new Queue();

let intervalId;


const canvas = document.getElementById('scene');


function scrollToBottom(elementId) {
    var element = document.getElementById(elementId);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}


function resizeScene() {

	sizer.resizeFrame(canvas);
	sizer.resizeElevator();
	sizer.repositionElevator();
	sizer.resizeFloors(floors);

//	for (var floor of floors){
//	    sizer.redrawObjects(floor.objects)
//	}
}





window.addEventListener('resize', resizeScene);

initializer.init(floors, elevatorSpawnPosition); // Initial call
scrollToBottom('scene');
const elevator = document.getElementById('elevator');
const player = Player.spawnPlayer(1);

async function startElevator(){

    thisElevator.startElevator();

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
}

// DE AICI SE POATE JONGLA CU DECIZIA DE PLECARE A LIFTULUI - poti adauga oricate functii pe care sa le verifici inainte sa plece
async function initialize(){
	if(!callQueue.isEmpty()){
	    // Define busy? Maybe just isMoving is needed
		if(!thisElevator.isMoving && !thisElevator.isBusy){
		    if (!thisElevator.isSomeoneStillAtDestination()){
                if(thisElevator.isOccupied){
                    // If someone inside elevator we will only accept internal calls. No external calls can move the elevator until the entity inside decides to move;
                    if (callQueue.front().type == "internal"){
                        console.debug("START1")
                        startElevator();
                    }
                    else{
                        // Basically an open doors call to the elevator if someone new comes when the doors have closed and someone is inside
                        if (callQueue.front().requestFloor == thisElevator.currentFloor){
                            console.debug("START1")
                            startElevator();
                        }
                    }
                }
                else{
                    // If no one is inside and the elevator is not busy - it can start
                    console.debug("START2")
                    startElevator();
                }
        }

        }
    }
}
intervalId2 = setInterval(initialize, 100);
intervalId3 = setInterval(entityCleaner, 1000);

function entityCleaner(){
    for (var entity of Entity.entityList){
        if (entity.state == "DONE"){
            Entity.removeEntity(entity);
        }
    }
}
function displayElevatorState(){
	console.debug(`Elevator current floor is: ${thisElevator.currentFloor}` )

	console.log(`Elevator direction is: ${thisElevator.movingDirection}` )
	console.log(`Doors: ${thisElevator.areDoorsOpen}` )
	console.log(`Is elevator moving: ${thisElevator.isMoving}` )
	console.log(`Is elevator occupied: ${thisElevator.isOccupied}` )
	console.log(`Is elevator busy: ${thisElevator.isBusy}` )
	console.log(`Is elevator at destination: ${thisElevator.isAtDestination}` )


}



function createExternalRequest(floor, direction, id){
	var call = new Request(floor, direction, "external", id);
	callQueue.addNewCall(call);


}

function createInternalRequest(floor, id){
	var call = new Request(floor,  "UP", "internal", id);
	callQueue.addNewCall(call);

}



function displayRequestCalls(){
	console.log(callQueue.printQueue());
}



