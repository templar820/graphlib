export default class CanvasItem {
  constructor(width, height, X, Y, property) {
    this.width = width;
    this.height = height;
    this.x = X;
    this.y = Y;
    this.property = property || {};
  }
}
