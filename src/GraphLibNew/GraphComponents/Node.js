export default class Node {
    name = 'Node';

    label;

    constructor(node) {
      this.x = node.x;
      this.y = node.y;
      this.id = node.id;
      this.label = node.label;
      this.ports = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      this.selected = node.selected;
      this.deleted = node.deleted;
      this.property = node.property;
    }
}
