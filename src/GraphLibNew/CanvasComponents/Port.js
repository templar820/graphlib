import CanvasItem from './CanvasItem';

export default class Port extends CanvasItem {
  name = 'Port';

  full = false;

  constructor(type, parent, X, Y, selected, d) {
    let size = 20;
    if (type === 'super-top') size = 40;
    super(size, size, X, Y);
    this.size = size;
    this.selected = selected;
    this.parent = parent;
    this.type = type;
    this.d = d;
    this.resetSize = this.resetSize.bind(this);
  }

  resetSize() {
    switch (this.type) {
    case 'super-top':
      this.x = this.parent.x + this.parent.width / 2;
      this.y = this.parent.y;
      break;
    case 'result':
      this.x = this.parent.x + (this.parent.width / 2) * Math.cos(Math.PI / 4);
      this.y = this.parent.y + (this.parent.height / 2) * Math.sin(Math.PI / 4);
      break;
    case 'error':
      this.x = this.parent.x - (this.parent.width / 2) * Math.cos(Math.PI / 4);
      this.y = this.parent.y + (this.parent.height / 2) * Math.sin(Math.PI / 4);
      break;
    default:
      this.makeNodePorts();
      break;
    }
  }

  makeNodePorts() {
    const P = 2 * this.parent.width + 2 * this.parent.height;
    const width = this.parent.width;
    const height = this.parent.height;
    const delta = P / this.parent.ports.length;
    const x0 = this.parent.x;
    const y0 = this.parent.y;
    let x = 0;
    let y = 0;
    let way = 0;
    for (let i = 0; i < +this.type; i++) {
      way += delta;
      if (way > width) {
        if (way > width + height) {
          if (way > 2 * width + height) {
            y -= delta;
          } else {
            x -= delta;
          }
        } else if (way <= width + height) {
          y += delta;
        }
      } else if (way <= width) {
        x += delta;
      }
    }
    this.x = x0 + x;
    this.y = y0 + y;
  }
}
