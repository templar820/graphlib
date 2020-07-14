export default class PaintEdgeService {
  constructor(state, input, portService) {
    this.input = input;
    this.state = state;
    this.findPort = this.findPort.bind(this);
    this.optimizePaintEdge = this.optimizePaintEdge.bind(this);
    this.portService = portService;
  }

  findPort(id, type) {
    return this.state.paintNodes.find(el => el.id === id)?.ports.find(el => el.type === type)
      || this.state.paintActions.find(el => el.id === id)?.ports.find(el => el.type === type)
      || this.state.paintPortals.find(el => el.id === id)?.ports.find(el => el.type === type);
  }

  updateHover(edge) {
    edge.hovered = this.input.x > edge.x
      && this.input.x < (edge.x + edge.width)
      && this.input.y > edge.y
      && this.input.y < (edge.y + edge.height);
  }

  updateDragged() {

  }

  updateSelect(edge) {
    if ((edge.hovered && this.input.isLeftMouseButton)) {
      edge.selected = true;
    }
    if (
      edge.selected
      && !edge.hovered
      && this.input.isLeftMouseButton
      && !edge.movingPorts.find(el => el.selected === true)
    ) {
      edge.selected = false;
    }
  }

  updatePort(edge) {
    edge.ports.forEach(port => this.portService.updateAll(port));
    if (edge.selected) edge.movingPorts.forEach(port => this.portService.updateAll(port));
  }

  curveEdge(paintEdge, x, y) {
    // filter
    if (
      paintEdge.ports[1]
      && paintEdge.ports[2]
      && paintEdge.ports[1].x === paintEdge.ports[2].x
      && paintEdge.ports[1].y === paintEdge.ports[2].y
    ) {
      paintEdge.ports = [paintEdge.ports[0], paintEdge.ports[1]];
    }

    const l = paintEdge.ports.length;

    // first link
    if (l === 0) {
      paintEdge.ports.push({ x, y });
      return;
    }

    const lastPoint = paintEdge.ports[l - 1];
    const d = (Math.abs(x - lastPoint.x) > Math.abs(y - lastPoint.y)) ? 'x' : 'y';

    // second link
    if (l === 1) {
      if (lastPoint.x !== x || lastPoint.y !== y) {
        paintEdge.ports.push({ x, y, d });
      }
      return;
    }
    // if (paintEdge.isSuper) debugger
    // third, fourth link
    if (l >= 2 && l < 4) {
      if (d === 'x') {
        if (lastPoint.d === 'x') {
          lastPoint.x = x;
        } else {
          paintEdge.ports.push({ x, y: lastPoint.y, d });
        }
      } else if (lastPoint.d === 'y') {
        lastPoint.y = y;
      } else {
        paintEdge.ports.push({ x: lastPoint.x, y, d });
      }
    }

    if (l === 4) {
      if (d === 'x') {
        paintEdge.ports[3].x = x;
        if (paintEdge.ports[3].d !== 'x') paintEdge.ports[2].x = x;
      } else {
        paintEdge.ports[3].y = y;
        if (paintEdge.ports[3].d !== 'y') paintEdge.ports[2].y = y;
      }
    }
  }

  optimizePaintEdge(edge) {
    console.log(this.state);
  }

  updateAll(edge) {
    this.updateHover(edge);
    this.updateDragged(edge);
    this.updateSelect(edge);
    this.updatePort(edge);
  }
}
