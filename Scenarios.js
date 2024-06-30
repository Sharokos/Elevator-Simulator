class Scenarios {
  constructor(entity) {
    this.entity = entity;
    this.watcherInterval= setInterval(this.watcher.bind(this), 100); // Setting up the interval
  }


  watcher(){
    this.makeCall();
    this.leaveScene();
  }

  async leaveScene(){
    if (this.entity.travelComplete){
        await this.entity.moveTo(2000);
        this.entity.state = "DONE"
    }
  }

    // poti adauga aici un timp random de asteptare pana sa faca call-ul - momentan nenecesar
  makeCall(){
    if (this.entity.state == "INSIDE" && !this.entity.callTaken){
        this.entity.callTaken = true;
        this.entity.makeElevatorRequest();
    }
  }
  async moveToElevator(){
      var destination = parseInt(elevator.style.left) + 100;
      await this.entity.moveTo(destination);
      await this.entity.callElevator();


  }



  }