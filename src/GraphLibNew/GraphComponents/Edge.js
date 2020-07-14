export default class Edge {
  name = 'Edge';

  label;

  constructor(edge) {
    this.x = edge.x;
    this.y = edge.y;
    this.id = edge.id;
    this.label = edge.label;
    this.selected = edge.selected;
    this.property = edge.property;
    this.sourceId = edge.sourceId;
    this.sourceType = edge.sourceType;
    this.targetId = edge.targetId;
    this.targetType = edge.targetType;
    this.ports = edge.ports;
  }
}
