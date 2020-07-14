/* eslint-disable */
import CanvasItem from './CanvasItem';
import Port from './Port';

export default class PaintEdge extends CanvasItem{

  name = 'PaintEdge';

  constructor (edge){
    super( 200, 50, edge.x, edge.y, edge.property)
    this.sourcePort = edge.sourcePort;
    this.targetPort = edge.targetPort;

    this.ports = [];
    this.selected = edge.selected;
    this.deleted = null;
    this.id = edge.id;
    this.label = edge.label;
    this.movingPorts = [];
    if(edge.id){
      this.movingPorts = [];
      this.makePorts(edge);
      this.updateLabel();
    }
  }

  makePorts(edge){
    if(!edge.ports) debugger
    this.ports = edge.ports.map(el => {
      return new Port('angle',this, el.x, el.y, edge.selected, el.d);
    })
    // let shift = 100
    // this.ports[0].d = this.ports[1].d
    // if(this.ports[0][this.ports[0].d] < this.ports[1][this.ports[0].d]){
    //   this.ports[0][this.ports[0].d] +=shift;
    // } else {
    //   this.ports[0][this.ports[0].d] -=shift;
    // }
    // this.ports[this.ports.length -1].d = this.ports[this.ports.length-2].d
    // if(this.ports[this.ports.length -1][this.ports[this.ports.length -1].d] < this.ports[1][this.ports[this.ports.length -1].d]){
    //   this.ports[this.ports.length -1][this.ports[this.ports.length -1].d] +=shift;
    // } else {
    //   this.ports[this.ports.length -1][this.ports[this.ports.length -1].d] -=shift;
    // }
    this.ports.shift();
    this.ports.unshift(this.sourcePort);
    this.ports.pop();
    this.ports.push(this.targetPort);
    if(!this.sourcePort || !this.targetPort) debugger
    this.sourcePort.full = this;
    this.targetPort.full = this;

  }

  toUpdatePaintEdge(paintEdge, port){
    this.id = paintEdge.id;
    if (paintEdge.ports.findIndex(el => el ==port) === 0){
      //дернули за начало
      this.targetPort = paintEdge.targetPort;
      this.ports[0] = paintEdge.ports[3];
      this.ports[1] = paintEdge.ports[2];
      this.ports[2] = paintEdge.ports[1];
      this.ports[1].d = (this.ports[1].d === 'y')?'x':'y';
      this.ports[2].d = (this.ports[2].d === 'y')?'x':'y';
    } else {
      //дернули за конец
      this.sourcePort = paintEdge.sourcePort;
      this.ports[0] = paintEdge.ports[0];
      this.ports[1] = paintEdge.ports[1];
      this.ports[2] = paintEdge.ports[2];
    }
  }

  update (){
    const i = 0;
    let links = this.ports;
    if (links[2 + i].d === 'x') {
      if (links[0 + i].d !== 'x') links[1 + i].x = links[0 + i].x;
      if (links[3 + i].d !== 'x') links[2 + i].x = links[3 + i].x;
    } else {
      if (links[0 + i].d !== 'y') links[1 + i].y = links[0 + i].y;
      if (links[3 + i].d !== 'y') links[2 + i].y = links[3 + i].y;
    }
    this.ports = links;
    this.updateLabel();
  }

  updateLabel(){
    let maxWay = 0;
    let movingPorts = [];
    for (let i = 0; i < this.ports.length-1; i++){
      let port = this.ports[i];
      let port1 = this.ports[i+1];
      let x = (this.ports[i].x + this.ports[i+1].x)/2;
      let y = (this.ports[i].y + this.ports[i+1].y)/2;
      let dimension = (this.ports[i].x - this.ports[i+1].x === 0)? 'x' : 'y';``
      if(this.movingPorts.length){
        this.movingPorts[i].x = x;
        this.movingPorts[i].y = y;
        this.movingPorts[i].d = dimension;
      } else {
        movingPorts.push(new Port('point',this, x, y, this.selected, dimension))
      }
      let way = Math.sqrt((port.x - port1.x)**2 + (port.y - port1.y)**2);
      if (way > maxWay){
        maxWay = way;
        this.x = (port1.x - port.x !==0)?(port1.x + port.x)/2: port.x;
        this.y = (port1.y - port.y !==0)?(port1.y + port.y)/2: port.y;
      }
    }
    if (!this.movingPorts.length) this.movingPorts = movingPorts;
    this.x = this.x - this.width;
    this.y = this.y - this.height;
  }
}

