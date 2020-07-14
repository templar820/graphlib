import CanvasPainter from './CanvasPainter';
import PaintNode from '../CanvasComponents/PaintNode';
import Node from '../GraphComponents/Node';
import PaintAction from '../CanvasComponents/PaintAction';
import Action from '../GraphComponents/Action';
import PaintPortal from '../CanvasComponents/PaintPortal';
import Portal from '../GraphComponents/Portal';

export default class CanvasPainterListener extends CanvasPainter {
  map = {
    dblclick: this.dblClick,
    wheel: this.trackWheel,
    mousemove: this.move,
    mousedown: this.mousedown,
    mouseup: this.mouseup,
    mouseout: this.out,
    keydown: this.keyManager,
    mouseover: this.mouseOver,
    click: this.onClick,
    keyup: this.keyUp,
  };

  constructor(canvasContainer, syncCallback) {
    super(canvasContainer, syncCallback);

    Object.keys(this.map).forEach(event => {
      this.canvas.addEventListener(event, e => {
        if (event !== 'keydown') {
          e.preventDefault();
          e.stopPropagation();
        }
        this.map[event].call(this, e);
      });
    });
  }

  update = callbacks => {
    const objectUpdate = (objArray, objService, callback) => {
      objArray.forEach(el => {
        objService.updatePort(el);
        callback.forEach(s => {
          objService[s](el);
        });
      });
    };
    objectUpdate(this.state.paintNodes, this.paintNodeService, callbacks);
    objectUpdate(this.state.paintEdges, this.paintEdgeService, callbacks);
    objectUpdate(this.state.paintActions, this.paintNodeService, callbacks);
    objectUpdate(this.state.paintPortals, this.paintNodeService, callbacks);
    this._paint();
  }

  keyUp(e) {
    this.input.onKeyup(e);
  }

  mouseOver() {
    this.canvas.focus();
  }

  onClick(e) {
    this.input.onClick(e);
    // if (!this.input.readyToCreateNode) debugger
    if (this.input.clicked && !this.getDraggableObject()) {
      this.Command.sendCommand('Select');
    }
  }

  keyManager(e) {
    this.input.onKeydown(e);

    if (this.input.isAltKey) {
      console.log(this.state);
    }

    if (this.input.isCopy) {
      this.Command.sendCommand('Copy');
    }

    if (this.input.isPaste) {
      this.Command.sendCommand('Paste');
    }

    if (this.input.isUndo) {
      this.Command.sendCommand('Undo');
    }

    if (this.input.isRedo) {
      this.Command.sendCommand('Redo');
    }

    if (this.input.isDelete) {
      this.Command.sendCommand('Delete');
    }
  }

  out(e) {
    this.input.onMouseOut(e);
  }

  trackWheel(event) {
    this.input.onWheel(event);
    if (this.input.isControl) {
      this.Palette.drawGrid(this.WIDTH, this.HEIGHT, this.input);
      this._paint();
    }
  }

  mousedown(e) {
    this.input.onMousedown(e);
    this.update(['updateSelect']);
    this.selectArea.changeCoords('source', this.input.x, this.input.y);
  }

  mouseup(e) {
    this.input.onMouseup(e);
    if (this.needRenderGrid) {
      this.Palette.drawGrid(this.WIDTH, this.HEIGHT, this.input);
      this.needRenderGrid = false;
    }
    this.update(['updateDragged']);
    this.setDraggableObject(null);
    this.selectArea.foundElements();
    // команда апдейт Нода
  }

  dblClick(e) {
    this.input.onDblclick(e);
    if (this.input.dblclicked) {
      let exportState = null;
      if (this.input.readyToCreateNode) {
        exportState = [new PaintNode(new Node({ x: this.input.x, y: this.input.y }), this.STEP)];
      } else if (this.input.readyToCreatePortal) {
        exportState = [new PaintPortal(new Portal({ x: this.input.x, y: this.input.y }), this.STEP)];
      } else if (this.input.readyToCreateAction) {
        exportState = [new PaintAction(new Action({ x: this.input.x, y: this.input.y }), this.STEP)];
      }
      if (exportState) this.Command.sendCommand('Create', exportState);
    }
  }

  move(event) {
    this.input.onMousemove(event);
    if (this.input.isControl) this.needRenderGrid = true;
    this.update(['updateHover', 'updateDragged']);

    if (this.input.isLeftMouseButton && !event.ctrlKey) {
      this.selectArea.changeCoords('target', this.input.x, this.input.y);
    }
  }
}
