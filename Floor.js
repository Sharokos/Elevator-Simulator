
class Floor {
  constructor(floorNumber, bottomLevel, drawing, objects) {
    this.bottomLevel = bottomLevel;
    this.drawing = drawing;
    this.floorNumber = floorNumber;
    this.objects = objects;
  }


  static generateFloors(numberOfFloors){
      const floors = [];

      var rand = new Randomness();


      for (let i=0; i<numberOfFloors; i++){
        var drawing = new DrawingProperties(3, 1.5, "floor", "path", 0, "portrait");
        var objects = [];
        var numberOfObjects = rand.getRandomInt(1,20);
        ForbiddenSpawnZone.createZone(elevatorSpawnPosition,elevatorSpawnPosition + elevatorBtnsPosition + 30,i)
        for (let j=0; j<numberOfObjects; j++){
                var obj = Object.generateObject(rand,i);

                if (obj != null){
                    objects.push(obj);
                }
        }
        floors.push(new Floor(i,0,drawing, objects));
      }
      return floors;
  }


    display(){

        return "Bottom Level: " + this.bottomLevel + " --- Floor number: " + this.floorNumber + "--- 1st Obj: " + this.objects[0].display();
    }


}


