/* eslint-disable */

import DrawingRules from './DrawingRules';

export default class Palette {
  constructor(ctx, backgroundCtx, step, input) {
    this.ctx = ctx;
    this.backgroundCtx = backgroundCtx;
    this.step = step;
    this.input = input;
    this.drawingRules = new DrawingRules();
    this.PaintNode = this.PaintNode.bind(this);
    this.PaintEdge = this.PaintEdge.bind(this);
    this.PaintPortal = this.PaintPortal.bind(this);
    this.PaintAction = this.PaintAction.bind(this);
  }

  clear = (ctx, width, height) =>{
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.setTransform(this.input.scale, 0, 0, this.input.scale, this.input.wx, this.input.wy);
  }

  PaintLabel(el, shiftX = 10, shiftY = el.height/2) {
    let x = el.x + shiftX;
    let y = el.y + shiftY;
    let text = el.label;
    let width = el.width;
    let lineHeight = this.drawingRules[`get${el.name}FontOptions`](this.ctx);
    let words = text.split('-');
    let countWords = words.length;
    let line = '';
    for (let n = 0; n < countWords; n++) {
      let testLine = `${line + words[n]} `;
      let testWidth = this.ctx.measureText(testLine).width;
      if (testWidth > width) {
        this.ctx.fillText(line, x, y);
        line = `${words[n]} `;
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, y);
  }

  renderArrow(source, target, strokeStyle) {
    let arrowHead = 15;
    let angle = Math.atan2(target.y - source.y, target.x - source.x);
    this.ctx.beginPath();
    this.ctx.moveTo(target.x, target.y);
    this.ctx.lineTo(target.x - arrowHead * Math.cos(angle - Math.PI / 4), target.y - arrowHead * Math.sin(angle - Math.PI / 4));
    this.ctx.lineTo(target.x - arrowHead * Math.cos(angle - Math.PI / 4), target.y - arrowHead * Math.sin(angle - Math.PI / 4));
    this.ctx.moveTo(target.x, target.y);
    this.ctx.lineTo(target.x - arrowHead * Math.cos(angle + Math.PI / 4), target.y - arrowHead * Math.sin(angle + Math.PI / 4));
    this.ctx.lineTo(target.x, target.y);
    this.ctx.lineTo(target.x - arrowHead * Math.cos(angle - Math.PI / 4), target.y - arrowHead * Math.sin(angle - Math.PI / 4));
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
    this.ctx.fill();
  }


  PaintNode(node) {
    let radius = 6;
    this.drawingRules.getPaintNodeOptions(this.ctx, node);
    this.ctx.beginPath();
    this.ctx.moveTo(node.x + radius, node.y);
    this.ctx.lineTo(node.x + node.width - radius, node.y);
    this.ctx.quadraticCurveTo(node.x + node.width, node.y, node.x + node.width, node.y + radius);
    this.ctx.lineTo(node.x + node.width, node.y + node.height - radius);
    this.ctx.quadraticCurveTo(node.x + node.width, node.y + node.height, node.x + node.width - radius, node.y + node.height);
    this.ctx.lineTo(node.x + radius, node.y + node.height);
    this.ctx.quadraticCurveTo(node.x, node.y + node.height, node.x, node.y + node.height - radius);
    this.ctx.lineTo(node.x, node.y + radius);
    this.ctx.quadraticCurveTo(node.x, node.y, node.x + radius, node.y);
    this.ctx.stroke();
    this.ctx.fill();
    this.PaintLabel(node);
    this.ctx.restore();

    node.ports.forEach(port => {
      if(node.hovered || port.hovered){
        this.PaintPort(port);
      }
    });
  }


  PaintPortal(portal) {
    this.PaintLabel(portal, 0);
    portal.ports.forEach(port => {
        this.PaintPort(port);
    });
  }


  PaintAction(action) {
    let radius = 6;
    this.drawingRules.getPaintActionOptions(this.ctx, action);
    this.ctx.beginPath();
    this.ctx.moveTo(action.x + action.width/2, action.y);
    this.ctx.lineTo(action.x + action.width - radius, action.y + action.height*1/4);
    this.ctx.quadraticCurveTo(action.x + action.width, action.y + action.height*1/4, action.x + action.width, action.y + action.height*1/4 + radius);
    this.ctx.lineTo(action.x + action.width, action.y + action.height*3/4 - radius);
    this.ctx.quadraticCurveTo(action.x + action.width, action.y + action.height*3/4, action.x + action.width - radius, action.y + action.height*3/4);
    this.ctx.lineTo(action.x + action.width/2 + radius, action.y + action.height);
    this.ctx.quadraticCurveTo(action.x + action.width/2, action.y + action.height, action.x + action.width/2 - radius, action.y + action.height);
    this.ctx.lineTo(action.x + radius, action.y + action.height*3/4);
    this.ctx.quadraticCurveTo(action.x, action.y + action.height*3/4, action.x, action.y + action.height*3/4 - radius);
    this.ctx.lineTo(action.x, action.y + action.height*1/4 + radius);
    this.ctx.quadraticCurveTo(action.x, action.y + action.height*1/4, action.x + radius, action.y + action.height*1/4);
    this.ctx.lineTo(action.x + action.width/2 - radius, action.y);
    this.ctx.quadraticCurveTo(action.x + action.width/2, action.y, action.x + action.width/2 + radius, action.y);
    this.ctx.stroke();
    this.ctx.fill();
    this.PaintLabel(action, 20, action.height/2 + 10);
    this.ctx.restore();
    action.ports.forEach(port => {
      if(action.hovered || port.hovered){
        this.PaintPort(port);
      }
    });
  }


  PaintPort(port) {
    if (port.hovered) {
      let outlineCircle = new Path2D();
      this.drawingRules.getHoveredPortOptions(this.ctx, port);
      outlineCircle.arc(port.x, port.y, port.width, 0, 2 * Math.PI);
      this.ctx.fill(outlineCircle);
    }

    this.drawingRules.getPortOptons(this.ctx, port);
    let circle = new Path2D();
    circle.moveTo(port.x, port.y);
    circle.arc(port.x, port.y, port.width / 2, 0, 2 * Math.PI);
    this.ctx.stroke(circle);
    this.ctx.fill(circle);

  }

  curveLine(edge) {
    this.ctx.lineWidth = edge.selected ? 1 : 2;
    for (let i = 0; i < edge.ports.length - 1; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(edge.ports[i].x, edge.ports[i].y);
      this.ctx.lineTo(edge.ports[i + 1].x, edge.ports[i + 1].y);
      this.ctx.stroke();
      this.ctx.fill();
      this.renderArrow(edge.ports[i], edge.ports[i + 1]);
    }
  }

  PaintEdge(edge) {
    this.drawingRules.getPaintEdgeOptions(this.ctx, edge);
    if (edge.selected) edge.movingPorts.forEach(port => this.PaintPort(port));
    this.curveLine(edge);
    if(edge.id) this.PaintLabel(edge);
  }

  drawGrid = (width, height) => {
    this.clear(this.backgroundCtx, width, height, this.input);
    let shiftX = Math.floor((this.input.wx - this.input.wx%this.step) / (this.step*this.input.scale));
    let shiftY = Math.floor((this.input.wy - this.input.wy%this.step) / (this.step*this.input.scale));
    for( let i = 0 - shiftX; i <(100 - shiftX); i++) {
      for( let j = 0 - shiftY; j < (100 - shiftY); j++) {
        this.backgroundCtx.fillRect(i*this.step, j*this.step,4,4);
      }
    }
  }

  paintSelectArea(area){
    this.ctx.beginPath();
    this.ctx.setLineDash([2, 3]);
    this.ctx.strokeStyle = 'black';
    this.ctx.moveTo(area.left, area.top);
    this.ctx.lineTo(area.right, area.top);
    this.ctx.lineTo(area.right, area.bot);
    this.ctx.lineTo(area.left, area.bot);
    this.ctx.lineTo(area.left, area.top);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }
}





