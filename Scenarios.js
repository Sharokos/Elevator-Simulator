class Scenarios {
  constructor() {}

  async moveToElevator(entity){
      var destination = parseInt(elevator.style.left) + 100;

      await entity.moveTo(destination);
//      console.log("FIRST CALL MOVE SCENARIO")

      await entity.callElevator();
//      console.log("CALL ELEVATOR SCENARIO")
//      await entity.moveTo(destination - 100, "GET IN");
//      console.log("2ND CALL - GET INSIDE")
//      await entity.makeElevatorRequest();
//      await entity.moveTo(destination + 100,"GET OUT");
//      await entity.moveTo(2000, "LEAVE SCENE");
  }



  }