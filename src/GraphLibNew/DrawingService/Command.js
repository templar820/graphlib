import Node from '../GraphComponents/Node';
import Edge from '../GraphComponents/Edge';
import PaintEdge from '../CanvasComponents/PaintEdge';
import PaintNode from '../CanvasComponents/PaintNode';
import PaintPortal from '../CanvasComponents/PaintPortal';
import PaintAction from '../CanvasComponents/PaintAction';
import Action from '../GraphComponents/Action';
import Portal from '../GraphComponents/Portal';

export default class Command {
  buff=[];

  constructor(canvasPainter, syncCallback) {
    this.syncCallback = syncCallback;
    this.canvasPainter = canvasPainter;
  }

  sendCommand(event, state) {
    switch (event) {
    case 'Create':
      this.createElements(state);
      break;
    case 'Select':
      this.selectElements();
      break;
    case 'UpdateActions':
      this.updateActions(state);
      break;
    case 'Delete':
      this.deleteElements();
      break;
    case 'Copy':
      this.copyElements();
      break;
    case 'Paste':
      this.pasteElements();
      break;
    default:
      break;
    }
  }

  cleanPaintNode(node, selected = false, deleted = false) {
    node.selected = selected;
    node.deleted = deleted;
    return new Node(node);
  }

  cleanPaintAction(action, selected = false, deleted = false) {
    action.selected = selected;
    action.deleted = deleted;
    return new Action(action);
  }

  cleanPaintPortal(portal, selected = false, deleted = false) {
    portal.selected = selected;
    portal.deleted = deleted;
    return new Portal(portal);
  }

  cleanPaintEdge(edge, selected, deleted) {
    edge.selected = selected;
    edge.deleted = deleted;
    return new Edge({
      id: edge.id,
      x: edge.x,
      y: edge.y,
      sourceId: edge.sourcePort.parent.id,
      sourceType: edge.sourcePort.type,
      targetId: edge.targetPort.parent.id,
      targetType: edge.targetPort.type,
      selected,
      deleted,
      ports: edge.ports,
    });
  }

  copyElements() {
    this.buff = [];
    this.canvasPainter.state.paintNodes.forEach(el => {
      if (el.selected) {
        this.buff.push(el);
      }
    });
    this.canvasPainter.state.paintEdges.forEach(el => {
      if (el.selected) {
        this.buff.push(el);
      }
    });
  }

  pasteElements() {
    const exportState = [];
    this.buff.forEach((el, index) => {
      if (el.name === 'PaintNode') {
        const node = this.cleanPaintNode(el, true);
        node.x += 100;
        node.y += 100;
        exportState.push(node);
      }
      if (el.name === 'PaintEdge') {
        const edge = this.cleanPaintEdge(el, true, false);
        edge.x += 50;
        edge.y += 50;
        exportState.push(edge);
      }
    });
    this.syncCallback('Create', exportState);
  }

  deleteElements(state) {
    const exportState = [];
    for (const [, value] of Object.entries(this.canvasPainter.state)) {
      value.forEach(el => {
        if (el.selected) {
          exportState.push(this[`clean${el.name}`](el, false, true));
        }
      });
    }
    this.syncCallback('Delete', exportState);
  }

  updateActions(state) {
    this.syncCallback('UpdateActions', [this.cleanPaintEdge(state[0])]);
  }

  createElements(state) {
    // eslint-disable-next-line array-callback-return
    const arrayElements = state.map(el => {
      if (el instanceof PaintNode) return this.cleanPaintNode(el, true);
      if (el instanceof PaintEdge) return this.cleanPaintEdge(el, true);
      if (el instanceof PaintPortal) return this.cleanPaintPortal(el, true);
      if (el instanceof PaintAction) return this.cleanPaintAction(el, true);
    });
    this.syncCallback('Create', arrayElements);
  }

  selectElements() {
    const exportState = [];
    for (const [, value] of Object.entries(this.canvasPainter.state)) {
      value.forEach(el => {
        if (el.selected) {
          exportState.push(this[`clean${el.name}`](el, true, false));
        }
      });
    }
    console.log(exportState);
    this.syncCallback('Select', exportState);
  }
}
