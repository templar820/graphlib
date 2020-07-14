import Quene from './Quene';
import ObjectsMap from './ObjectsMap';

export default class Grid {
  constructor(state, input, STEP) {
    this.input = input;
    this.step = STEP;
    this.state = state;
    this.costSoFar = new ObjectsMap();
    this.cameFrom = new ObjectsMap();
  }

  getWay(startPort, finishPort) {
    // TODO

    console.log('Start AI Edge');
    const start = startPort;
    // const goal = finishPort;

    this.costSoFar.clear();
    this.costSoFar.add(start, 0);

    this.cameFrom.clear();
    this.cameFrom.add(start, null);

    const frontier = new Quene();
    frontier.put(start);

    this.cameFrom.add(start, null);
    this.costSoFar.add(start, 0);

    // while (!frontier.isEmpty()) {
    //   // дай элемент из очереди
    //   const current = frontier.get();
    //
    //   if (current == goal) break;
    //
    //   this.getNeighbors(current).forEach(next => {
    //     const newCost = this.costSoFar.get(current) + this.heuristic(current, next);
    //     if (!this.costSoFar.has(next) || newCost < this.costSoFar.get(next)) {
    //       this.costSoFar.add(next, newCost);
    //       frontier.put(next);
    //       this.cameFrom.add(next, current);
    //     }
    //   });
    // }
    // debugger;
  }

  getNeighbors(current) {
    const shiftX = (this.input.wx - (this.input.wx % (this.step / 2))) / ((this.step / 2) * this.input.scale);
    const shiftY = (this.input.wy - (this.input.wy % (this.step / 2))) / ((this.step / 2) * this.input.scale);

    const top = { x: current.x, y: current.y - this.step };
    const right = { x: current.x + this.step, y: current.y };
    const bot = { x: current.x + this.step, y: current.y + this.step };
    const left = { x: current.x - this.step, y: current.y };
    return [top, right, bot, left].filter(el => {
      if (-shiftX * this.step <= el.x && el.x <= (100 - shiftX) * this.step
        && -shiftY * this.step <= el.y && el.y >= (100 - shiftY) * this.step) {
        return el;
      }
      return false;
    });
  }

  heuristic(a, b) {
    // Manhattan distance on a square grid
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
}
