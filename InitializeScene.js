//Initialize the scene

class InitializeScene {
  constructor(sizer, rand) {
    this.sizer = sizer;
    this.rand = rand;
  }



  createObjects(objects, floor){
    var count = 0
    for (var obj of objects){
        const objectVisual = document.createElement('div');
        objectVisual.setAttribute('class', 'objectVisual');
        objectVisual.setAttribute('id', "object_" + obj.associatedFloor + "_" + count);
        obj.htmlId = "object_" + obj.associatedFloor + "_" + count;
        objectVisual.style.height = sizer.calculateObjectSize(obj)[1] + "px";
        objectVisual.style.width = sizer.calculateObjectSize(obj)[0] + "px";
        objectVisual.style.left = sizer.calculateObjectPosition(obj) + "px";
        objectVisual.style.bottom = "0px";
        floor.appendChild(objectVisual);
        count +=1
    }

  }



  createFrame(){
    const frame = document.getElementById('scene')
    frame.style.width = this.sizer.getPxWidth();
    frame.style.height = this.sizer.getPxHeight();
  }

  createFloors(floors){
    const frame = document.getElementById('scene')
    var numberOfFloors = floors.length;
    var floorHeight = sizer.calculateFloorHeight();
    var containerHeight = floorHeight * numberOfFloors + "px"

    const floorContainer = document.createElement('div')
    floorContainer.setAttribute('class', 'floorContainer');
    floorContainer.setAttribute('id', 'floorContainer');
    floorContainer.style.height = containerHeight;
    frame.appendChild(floorContainer);
    var height = this.sizer.getHeight()
    var bottomLevel = -floorHeight

    for (let i = 0; i < numberOfFloors; i++) {
      const floor = document.createElement('div');
      floor.setAttribute('class', 'floor');
      floor.setAttribute('id', 'floor' + i);

      bottomLevel += floorHeight;
      floor.style.height = floorHeight + "px"
      floor.style.bottom = bottomLevel + "px"

      floors[i].bottomLevel = bottomLevel;
      floorContainer.appendChild(floor);
      //this.createObjects(floors[i].objects, floor);


    }


  }


  createElevator(){
    var elev = document.createElement('div')
    const scene = document.getElementById('floorContainer')
    elev.setAttribute('class', 'elevator');
    elev.setAttribute('id', 'elevator');
    var width = this.sizer.getWidth()
    var height = this.sizer.getHeight()
    var elevatorWidth = width / 15
    var ratio = 1.5
    var elevatorHeight = elevatorWidth * ratio
    var elevatorWidthPx = elevatorWidth + "px"
    var elevatorHeightPx = elevatorHeight + "px"
    elev.style.width = elevatorWidthPx
    elev.style.height = elevatorHeightPx
    elev.style.bottom = "0px"
    elev.style.left = "100px"
    scene.appendChild(elev)
  }


  init(floors){
    this.createFrame();
    this.createFloors(floors);
    this.createElevator()
  }


  }
















