export default class Action {
  name = 'Action';

  label;

  constructor(action) {
    this.x = action.x;
    this.y = action.y;
    this.id = action.id;
    this.label = action.label;
    this.ports = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    this.selected = action.selected;
    this.deleted = action.deleted;
    this.property = action.property;
  }
}
