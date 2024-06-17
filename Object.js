
class Object {
  constructor(type, drawing, htmlId, associatedFloor) {
    this.type = type;
    this.drawing = drawing;
    this.htmlId = htmlId;
    this.associatedFloor = associatedFloor;
  }

  static generateObject(rand, floor){

      var size = rand.getRandomInt(5,20)
      var left = rand.getRandomInt(1,100)/100

      // create function that checks if the position is legal (sa nu fie pe casa liftului, sa nu fie overlap...etc.. vezi tu.) si aplici:
      //do {
      //                     position = this.getRandomPosition(size);
        //                } while (this.isOverlapping(position, size));
      var drawing = new DrawingProperties(size, 1.5, "random", "path", left, "portrait");
      return new Object("random",drawing, 0, floor);
  }


  display(){
    return "Size: " + drawing.scale + " left position: " + drawing.left;
  }
}


