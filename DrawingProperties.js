
class DrawingProperties {
  constructor(scale, ratio, type, path, left, orientation) {
    this.scale = scale;
    this.ratio = ratio;
    this.type = type;
    this.path = path;
    this.left = left;
    this.orientation = orientation;
    this.actualLeft = sizer.calculateDrawingPosition(this.left)
    this.actualHeight = sizer.calculateDrawingSize(this.scale,this.ratio, this.orientation)[1]
    this.actualWidth = sizer.calculateDrawingSize(this.scale,this.ratio, this.orientation)[0]
  }
}


