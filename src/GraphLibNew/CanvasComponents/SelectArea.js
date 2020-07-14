export default class SelectArea {
  name = 'SelectArea'

  active = false;

  constructor(state, getDraggableObject, setDraggableObject, source, target, property) {
    this.getDraggableObject = getDraggableObject;
    this.setDraggableObject = setDraggableObject;
    this.source = source;
    this.target = target;
    this.state = state;
    this.selectedElements = [];
  }

  _setSize(source, target) {
    this.left = Math.min(source.x, target.x);
    this.right = Math.max(source.x, target.x);
    this.top = Math.max(source.y, target.y);
    this.bot = Math.min(source.y, target.y);
    this.source = source;
    this.target = target;
  }

  foundElements() {
    if (this.active) {
      for (const [, value] of Object.entries(this.state)) {
        value.forEach(element => {
          if (this.isInArea(element)) {
            element.selected = true;
          }
        });
      }
    }
    this.clear();
  }

  changeCoords(type, x, y) {
    if (type === 'source') {
      this._setSize({ x, y }, this.target);
    } else if (type === 'target') {
      this._setSize(this.source, { x, y });
      if (!this.getDraggableObject()) {
        this.setDraggableObject(this);
        this.active = true;
      }
    }
  }

  clear() {
    this._setSize({ x: 0, y: 0 }, { x: 0, y: 0 });
    this.active = false;
  }

  isInArea(el) {
    return (this.left <= el.x && el.x <= this.right && el.y >= this.bot && el.y <= this.top);
  }
}
