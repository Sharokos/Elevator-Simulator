// ITI TREBUIE ACTUAL POSITION SI PROBABIL ACTUAL DIMENSIONS LA TOATE
class Entity {
  constructor(type, drawing, htmlId, spawnFloor, direction) {
    this.type = type;
    this.drawing = drawing;
    this.htmlId = htmlId;
    this.spawnFloor = spawnFloor;
    this.direction = direction;
  }

  static generateEntity(rand, floor){

      var size = rand.getRandomInt(10,15)
      var left = rand.getRandomInt(1,100)/100

      var drawing = new DrawingProperties(size, 0.5, "random", "path", left, "portrait");
      return new Entity("random",drawing, 0, floor, "random");
  }


  moveToElevator(destination){
    const entityVisual = document.getElementById(this.htmlId);
    var startTime = null;
    const duration = 1000;
    const sizer = new SizeCalculator();
    var startPosition = sizer.calculateObjectPosition(this);
    var distance = Math.abs(startPosition - destination);
    if ( startPosition < destination){
        this.direction = "RIGHT";
    }
    else{
        this.direction = "LEFT";
    }
    var newPosition = 0;
    function animateRight(timestamp) {
        if (!startTime) startTime = timestamp;

        var progress = timestamp - startTime;
        var elapsedTime = Math.min(progress, duration);
        newPosition = startPosition + (distance / duration) * elapsedTime;
        entityVisual.style.left = newPosition + 'px';

        if (progress < duration) {
            requestAnimationFrame(animateRight);
        }
        else{
            console.log("Reached destination")
        }
    }
    function animateLeft(timestamp) {
        if (!startTime) startTime = timestamp;

        var progress = timestamp - startTime;
        var elapsedTime = Math.min(progress, duration);
        newPosition = startPosition - (distance / duration) * elapsedTime;

        entityVisual.style.left = newPosition + 'px';

        if (progress < duration) {
            requestAnimationFrame(animateLeft);
        }
        else{
            console.log("Reached destination")
        }
    }

    if (this.direction == "RIGHT"){
        console.log("Will move right");
        requestAnimationFrame(animateRight);

    } else{
        console.log("Will move left.")
        requestAnimationFrame(animateLeft);
    this.drawing.left = newPosition;

    }
  }




    displayPosition(){

        console.log("The left position is: " + this.drawing.left)
    }

}


