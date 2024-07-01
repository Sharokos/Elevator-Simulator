
class Object {
  constructor(type, drawing, htmlId, associatedFloor) {
    this.type = type;
    this.drawing = drawing;
    this.htmlId = htmlId;
    this.associatedFloor = associatedFloor;
  }



    // save all the left position + widths of generated object to define "forbidden" zones for next spawns :)
    // save the height of certain objects (tables/counters etc) in order to place "placable" objects on top of them :)

    //unele obiecte pot sa ignore forbidden zone (fereastra poate fi overlap cu un obiect uzual)
    // ar trebui sa ai un obiect general cu proprietati despre scena... gen la etajul x poti avea ferestre pe partea dreapta sau chestii de genul. Un sceneBuilder? care sa
    // asigure ca nu se deseneaza chestii nonsens
    // sau sa ai o structura generata random cu tipuri de obiecte/floor (prevalidata) si sa o iterezi spre generare
  static generateObject(rand, floor){
    var counter = 0
    var objGenerated = true;
    do {
        var size = rand.getRandomInt(5,20);
        var left = rand.getRandomInt(1,100)/100;
        var ratio = 1.5;
        var orientation = "portrait";
        var checkHeight = sizer.calculateDrawingSize(size,ratio, orientation)[1]
        var checkWidth = sizer.calculateDrawingSize(size,ratio, orientation)[0]
        var checkLeft = sizer.calculateDrawingPosition(left)
        var end = checkLeft + checkWidth;
        counter+= 1
        if (counter>50){
            objGenerated = false;
        }

    } while (!Object.isPositionLegal(checkLeft, end, floor) && counter <=50);
      if (objGenerated){
          var drawing = new DrawingProperties(size, ratio, "random", "path", left, orientation);
          ForbiddenSpawnZone.createZone(checkLeft, end, floor);
          return new Object("random",drawing, 0, floor);
      }
      else{
        return null;
      }
  }

  // maybe also include a zone so objects would not be stuck to each other unrealistically (zone calculated based on screen size)
  static areObjectsOverlapping(start1, end1, start2,end2){
    if(start1 >= start2 && end1 <= end2 ){
        return true;
    }
    if(start1 <= start2 && end1 >= start2){
        return true;
    }
    if(end1 >= end2 && start1 <= end2){
        return true;
    }
    return false;
  }

  static isPositionLegal(start, end, floor){
    for (var forbiddenZone of ForbiddenSpawnZone.getZonesPerFloor(floor)){
        // Object to be checked: start, end ---  forbidden zone: start, end
        if(Object.areObjectsOverlapping(start, end, forbiddenZone.start, forbiddenZone.end)){
            return false;
        }
    }
    return true;
  }
  display(){
    return "Size: " + drawing.scale + " left position: " + drawing.left;
  }
}


class ForbiddenSpawnZone {
    static zoneList = [];
    constructor(start,end,associatedFloor){
        this.start = start;
        this.end = end;
        this.associatedFloor = associatedFloor;
    }
    static createZone(start,end,floor){
        ForbiddenSpawnZone.zoneList.push(new ForbiddenSpawnZone(start,end,floor));
    }
    static getZonesPerFloor(floor){
        var return_zones = []
        for (var zone of ForbiddenSpawnZone.zoneList){
            if (zone.associatedFloor == floor){
                return_zones.push(zone);
            }

        }
    return return_zones;
    }
}


