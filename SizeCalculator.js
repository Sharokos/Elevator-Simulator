
class SizeCalculator {
  constructor() {
  //Empty constructor
  }

  getWindowDimensions(){
  	const aspectRatio = 16 / 9;

  	const width = document.documentElement.clientWidth - 50
  	const height = document.documentElement.clientHeight - 50

  	var returnWidth = width;
  	var returnHeight = height;
  	if (width / height < aspectRatio) {
  		returnHeight = width / aspectRatio
  	} else {
  		returnWidth = height * aspectRatio
  	}
  	return [returnWidth, returnHeight]
  }

  getHeight(){
    return this.getWindowDimensions()[1]
  }
  getWidth(){
    return this.getWindowDimensions()[0]
  }
  getPxWidth(){
    return this.getWidth() +"px";
  }
  getPxHeight(){
    return this.getHeight() +"px";
  }
  resizeFrame(frame){
    frame.style.width = this.getPxWidth();
    frame.style.height = this.getPxHeight();
  }
  calculateFloorHeight(){
    return this.getHeight() / 3
  }
  calculateElevatorSize(){
    var width = this.getWidth()
    var elevatorWidth = width / 15
    var ratio = 1.5
    var elevatorHeight = elevatorWidth * ratio
    return [elevatorWidth, elevatorHeight]
  }
  resizeElevator() {
    var elevator = document.getElementById("elevator")
  	var elevatorWidthPx = this.calculateElevatorSize()[0] + "px"
    var elevatorHeightPx = this.calculateElevatorSize()[1] + "px"
  	elevator.style.width = elevatorWidthPx
  	elevator.style.height = elevatorHeightPx

  }

  resizeFloors(floorClasses){
    var floors = document.getElementsByClassName("floor");

    var floorContainer = document.getElementById("floorContainer");
    var floorHeight = this.calculateFloorHeight();
    floorContainer.style.height = floorHeight * floors.length + "px";
    var bottomLevel = -floorHeight

    for (let i = 0 ;i<floors.length; i++){
        floors[i].style.height = floorHeight + "px";
        bottomLevel += floorHeight;
        floors[i].style.bottom = bottomLevel + "px"
        floorClasses[i].bottomLevel = bottomLevel;
    }


  }





  redrawObjects(objects){
    for (var obj of objects){
        this.calculateObjectSize(obj);
        this.resizeObject(obj.htmlId, obj);
        this.calculateObjectPosition(obj);
        this.repositionObject(obj.htmlId, obj);
    }

  }
  calculateObjectSize(object){
    var width = 0;
    var height = 0;
    if (object.drawing.orientation == "landscape"){
        width = this.getWidth()/object.drawing.scale;
        height = width/object.drawing.ratio;
    }
    else if (object.drawing.orientation == "portrait"){
        height = this.getHeight()/object.drawing.scale;
        width = height * object.drawing.ratio;
    }

    return [width, height];
  }
  calculateObjectPosition(object){
      var left = this.getWidth()*object.drawing.left;
      return left;
  }

  resizeObject(visualId, object){
    var visualObject = document.getElementById(visualId)
  	var objectWidthPx = this.calculateObjectSize(object)[0] + "px"
    var objectHeightPx = this.calculateObjectSize(object)[1] + "px"
  	visualObject.style.width = objectWidthPx
  	visualObject.style.height = objectWidthPx

  }
  repositionObject(visualId, object){
    var visualObject = document.getElementById(visualId)
    var objectLeftPx = this.calculateObjectPosition(object) + "px"

    visualObject.style.left = objectLeftPx

  }
}
