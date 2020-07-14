import CanvasItem from './CanvasItem';
import Port from './Port';

export default class PaintNode extends CanvasItem {
  name = 'PaintNode';

  label;

  constructor(node, STEP) {
    super(500, 100, node.x, node.y, node.property);
    this.x = Math.min(node.x - (node.x % STEP), node.x - (node.x % STEP) + STEP);
    this.y = Math.min(node.y - (node.y % STEP), node.y - (node.y % STEP) + STEP);
    this.id = node.id;
    this.node = node;
    this.label = node.label;
    this.ports = node.ports.map(currentItem => new Port(currentItem, this, node.x, node.y));
    this.ports.forEach(el => el.makeNodePorts());
    this.selected = node.selected;
  }
}
