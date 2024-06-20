class Scenarios {
  constructor() {}

  async moveToElevator(entity){
      var destination = parseInt(elevator.style.left) + 100;
      await entity.moveTo(destination, false, false);
      await entity.callElevator();
      await entity.moveTo(destination - 100, true, false);
      await entity.makeElevatorRequest();
      await entity.moveTo(destination, false, true);
      await entity.moveTo(2000, false);
  }



  }