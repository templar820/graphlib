export default class Portal {
  name = 'Portal';

  label;

  constructor(portal) {
    this.x = portal.x;
    this.y = portal.y;
    this.id = portal.id;
    this.label = portal.label;
    this.ports = [0];
    this.selected = portal.selected;
    this.deleted = portal.deleted;
    this.property = portal.property;
  }
}
