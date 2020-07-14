/* eslint-disable */
import CanvasItem from './CanvasItem.js';
import Port from './Port.js';

export default class PaintPortal extends CanvasItem {
  name = 'PaintPortal';

  constructor(portal, STEP) {
    super(100, 100, portal.x, portal.y, portal.property);
    this.x = Math.min(portal.x - portal.x % STEP, portal.x - portal.x % STEP + STEP);
    this.y = Math.min(portal.y - portal.y % STEP, portal.y - portal.y % STEP + STEP);
    this.id = portal.id;
    this.label = portal.label;
    this.ports = portal.ports.map(currentItem => {
      return new Port('super-top', this, portal.x, portal.y);
    });
    this.ports.forEach(el => el.resetSize());
    this.selected = portal.selected;
  }
}
