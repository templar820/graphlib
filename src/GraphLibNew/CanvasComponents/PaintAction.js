/* eslint-disable */
import CanvasItem from './CanvasItem.js';
import Port from './Port.js';

export default class PaintAction extends CanvasItem {
  name = 'PaintAction';

  constructor(action, STEP) {
    super(500, 100, action.x, action.y, action.property);
    this.x = Math.min(action.x - action.x % STEP, action.x - action.x % STEP + STEP);
    this.y = Math.min(action.y - action.y % STEP, action.y - action.y % STEP + STEP);
    this.id = action.id;
    this.label = action.label;
    this.ports = action.ports.map(currentItem => {
      return new Port(currentItem, this, action.x, action.y);
    });
    this.ports.forEach(el => el.makeNodePorts());
    this.selected = action.selected;
  }
}
