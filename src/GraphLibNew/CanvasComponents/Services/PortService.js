import PaintEdge from '../PaintEdge';
import Port from '../Port';

export default class PortService {
  constructor(input, getDraggableObject, setDraggableObject, Command, grid) {
    this.grid = grid;
    this.input = input;
    this.setDraggableObject = setDraggableObject;
    this.getDraggableObject = getDraggableObject;
    this.Command = Command;
    this.hoveredPort = false;
  }

  updateCoords(port) {
    const xDis = this.input.x - port.dragged.x;
    const yDis = this.input.y - port.dragged.y;
    const { index } = port.dragged;
    if (port.d === 'x') {
      port.parent.ports[index].x = xDis;
      port.parent.ports[index + 1].x = xDis;
    } else {
      port.parent.ports[index].y = yDis;
      port.parent.ports[index + 1].y = yDis;
    }
  }

  updateHover(port) {
    const newHovered = ((this.input.x - port.x) ** 2 + (this.input.y - port.y) ** 2 < (port.width) ** 2 + port.width);
    if (port.hovered && !newHovered) {
      this.hoveredPort = false;
    }
    port.hovered = newHovered;
  }

  updateDragged(port) {
    const draggableObject = this.getDraggableObject();

    if (!this.input.isLeftMouseButton && draggableObject instanceof Port) {
      port.dragged = null;
      this.setDraggableObject(false);
    }
    if (port.dragged) {
      this.updateCoords(port);
    }
    if (this.input.isLeftMouseButton && port.type !== 'angle') {
      if (port.hovered) {
        if (!draggableObject) {
          if (port.full) {
            // Начинаем перевешивать стрелку
            const paintEdge = port.full;
            const newEdge = new PaintEdge({ label: paintEdge.label });
            newEdge.toUpdatePaintEdge(paintEdge, port, this.input);
            this.setDraggableObject(newEdge);
          } else {
            this.setDraggableObject(new PaintEdge({
              sourcePort: port,
            }));
          }
        }
        if (draggableObject instanceof PaintEdge && !this.checkPort(draggableObject, port) && !this.hoveredPort) {
          this.optimizePortPlacement(draggableObject);
        }
        if (port.type === 'point') {
          port.dragged = {
            x: this.input.x - port.x,
            y: this.input.y - port.y,
            index: port.parent.movingPorts.findIndex(el => el === port),
          };
          this.setDraggableObject(port);
        }
      }
    } else if (port.hovered && port.type !== 'angle' && !port.full && draggableObject instanceof PaintEdge) {
      const paintEdge = draggableObject;
      this.setDraggableObject(null);
      if (paintEdge.sourcePort instanceof Port) {
        paintEdge.targetPort = port;
      } else {
        paintEdge.sourcePort = port;
        paintEdge.ports[1].d = (paintEdge.ports[1].d === 'y') ? 'x' : 'y';
        paintEdge.ports[2].d = (paintEdge.ports[2].d === 'y') ? 'x' : 'y';
      }
      if (paintEdge.sourcePort.parent.id !== paintEdge.targetPort.parent.id) {
        if (!paintEdge.id) {
          this.Command.sendCommand('Create', [paintEdge]);
        } else {
          this.Command.sendCommand('UpdateActions', [paintEdge]);
        }
      }
    }
  }

  optimizePortPlacement(paintEdge) {
    this.hoveredPort = true;
    this.grid.getWay(paintEdge.sourcePort, paintEdge.targetPort);
  }

  updateSelect(port) {
    if (port.dragged || (port.hovered && this.input.isLeftMouseButton)) {
      port.selected = true;
    }
    if (port.selected && !port.hovered && this.input.isLeftMouseButton) {
      port.selected = false;
    }
  }

  checkPort(paintEdge, port) {
    // TODO Проверить не пришла ли стрелка в тот же объект из которого выходит
    return false;
  }

  updateAll(port) {
    this.updateHover(port);

    this.updateDragged(port);

    this.updateSelect(port);
  }
}
