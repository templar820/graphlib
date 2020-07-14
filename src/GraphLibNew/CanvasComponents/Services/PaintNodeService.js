export default class PaintNodeService {
  constructor(input, getDraggableObject, setDraggableObject, portService) {
    this.input = input;
    this.setDraggableObject = setDraggableObject;
    this.getDraggableObject = getDraggableObject;
    this.portService = portService;
  }

  updateCoords(node) {
    node.x = this.input.x - node.dragged.x;
    node.y = this.input.y - node.dragged.y;
    node.ports.forEach(el => el.resetSize());
  }

  updateHover(node) {
    node.hovered = this.input.x > node.x
      && this.input.x < (node.x + node.width)
      && this.input.y > node.y
      && this.input.y < (node.y + node.height);
  }

  updateDragged(node) {
    const draggableObject = this.getDraggableObject();
    if (!this.input.isLeftMouseButton && draggableObject?.id === node.id) {
      node.dragged = null;
      this.setDraggableObject(false);
    }
    if (node.dragged) {
      this.updateCoords(node);
    }

    if (node.hovered && !node.ports.find(el => el.hovered)) {
      if (this.input.isLeftMouseButton && !draggableObject) {
        node.dragged = {
          x: this.input.x - node.x,
          y: this.input.y - node.y,
        };
        this.setDraggableObject(node);
      }
    }
  }

  updateSelect(node) {
    if (node.dragged || (node.hovered && this.input.isLeftMouseButton)) {
      node.selected = true;
    }
    if (node.selected && !node.hovered && this.input.isLeftMouseButton) {
      node.selected = false;
    }
  }

  updatePort(node) {
    node.ports.forEach(port => {
      this.portService.updateAll(port);
    });
  }

  updateAll(node) {
    this.updatePort(node);
    this.updateHover(node);
    this.updateDragged(node);
    this.updateSelect(node);
  }
}
