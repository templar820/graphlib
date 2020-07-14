// Приблизиться удалиться
// Нарисовать сетку
// Драгать полотно
// Алгоритм отрисовки элемента
// DrawNode, DrawEdge ... in enter -> node, edge
// Листенсеры повесить
import PaintNode from '../CanvasComponents/PaintNode';
import Palette from './Palette';
import Input from './Input';
import PaintEdge from '../CanvasComponents/PaintEdge';
import PaintNodeService from '../CanvasComponents/Services/PaintNodeService';
import PaintEdgeService from '../CanvasComponents/Services/PaintEdgeService';
import Command from './Command';
import SelectArea from '../CanvasComponents/SelectArea';
import Node from '../GraphComponents/Node';
import Edge from '../GraphComponents/Edge';
import PortService from '../CanvasComponents/Services/PortService';
import Grid from '../CanvasComponents/Services/Grid';
import Portal from '../GraphComponents/Portal';
import PaintPortal from '../CanvasComponents/PaintPortal';
import Action from '../GraphComponents/Action';
import PaintAction from '../CanvasComponents/PaintAction';

export default class CanvasPainter {
    // высота канваса
    HEIGHT;

    // ширина канваса
    WIDTH;

    // сам канвас
    canvas;

    // контекст конваса
    ctx;

    // контекс бэкграндного канваса
    backgroundCtx;

    // бэкграндный канвас
    background;

    // состояние мыши

    STEP = 100;

    needRenderGrid;

  #draggableObject = {
    data: null,
  };

  getDraggableObject=() => this.#draggableObject.data

  setDraggableObject= value => {
    this.#draggableObject.data = value;
  }

  constructor(canvasContainer, syncCallback) {
    this._createCanvas(canvasContainer);
    this.input = new Input(this.canvas);
    this.Palette = new Palette(this.ctx, this.backgroundCtx, this.STEP, this.input);
    this.Command = new Command(this, syncCallback);
    this.state = {
      paintNodes: [],
      paintEdges: [],
      paintActions: [],
      paintPortals: [],
    };
    this.isAnyHovered = false;
    this.grid = new Grid(this.state, this.input, this.STEP);
    this.portService = new PortService(
      this.input,
      this.getDraggableObject,
      this.setDraggableObject,
      this.Command,
      this.grid
    );
    this.paintEdgeService = new PaintEdgeService(this.state, this.input, this.portService);
    this.paintNodeService = new PaintNodeService(
      this.input,
      this.getDraggableObject,
      this.setDraggableObject,
      this.portService
    );
    this.Palette.drawGrid(this.WIDTH, this.HEIGHT, this.input);
    this.selectArea = new SelectArea(
      this.state,
      this.getDraggableObject,
      this.setDraggableObject,
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    );
  }

  _createCanvas(canvasContainer) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.backgroundColor = 'transparent';
    canvas.style.position = 'absolute';
    canvas.style.outline = 'none';

    const background = document.createElement('canvas');
    background.style.width = '100%';
    background.style.height = '100%';
    background.style.outline = 'none';

    const GraphContainer = canvasContainer;
    GraphContainer.style.padding = '0px !important';
    GraphContainer.style.position = 'relative';
    GraphContainer.style.overflow = 'hidden';

    GraphContainer.appendChild(canvas);
    GraphContainer.appendChild(background);

    background.width = background.offsetWidth;
    background.height = background.offsetHeight;
    this.backgroundCtx = background.getContext('2d');
    this.background = background;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.tabIndex = 0;
    canvas.focus();

    this.HEIGHT = canvas.offsetHeight;
    this.WIDTH = canvas.offsetWidth;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    window.onresize = () => {
      canvas.width = GraphContainer.offsetWidth;
      canvas.height = GraphContainer.offsetHeight;
      background.width = GraphContainer.offsetWidth;
      background.height = GraphContainer.offsetHeight;
      this.Palette.drawGrid(this.WIDTH, this.HEIGHT);
      this._paint();
    };
  }

  render(elements) {
    this.state.paintNodes = [];
    this.state.paintEdges = [];
    this.state.paintPortals = [];
    this.state.paintActions = [];

    elements.forEach(el => {
      switch (el.constructor) {
      case Node:
        this.state.paintNodes.push(new PaintNode(el, this.STEP));
        break;
      case Edge:
        // TODO Порядок данных.
        el.sourcePort = this.paintEdgeService.findPort(el.sourceId, el.sourceType);
        el.targetPort = this.paintEdgeService.findPort(el.targetId, el.targetType);
        this.state.paintEdges.push(new PaintEdge(el));
        break;
      case Portal:
        this.state.paintPortals.push(new PaintPortal(el, this.STEP));
        break;
      case Action:
        this.state.paintActions.push(new PaintAction(el, this.STEP));
        break;
      default:
        break;
      }
    });
    this._paint();
  }

  _paint() {
    const paintObjects = (objectsArray, drawFunction) => {
      objectsArray.forEach(el => {
        if (!this.isAnyHovered && el.hovered) this.isAnyHovered = true;
        // Условие для ситуации перевешивания стрелки
        if (el instanceof PaintEdge) {
          if (el.id !== this.getDraggableObject()?.id) {
            el.update();
            drawFunction(el);
          }
        } else {
          drawFunction(el);
        }
      });
    };

    this.Palette.clear(this.ctx, this.WIDTH, this.HEIGHT, this.input);
    const draggableObject = this.getDraggableObject();
    this.isAnyHovered = false;

    paintObjects(this.state.paintNodes, this.Palette.PaintNode);
    paintObjects(this.state.paintEdges, this.Palette.PaintEdge);
    paintObjects(this.state.paintPortals, this.Palette.PaintPortal);
    paintObjects(this.state.paintActions, this.Palette.PaintAction);

    this.canvas.style.cursor = this.isAnyHovered ? 'pointer' : 'default';

    if (draggableObject instanceof PaintEdge) {
      this.paintEdgeService.curveEdge(draggableObject, this.input.x, this.input.y);
      this.Palette.PaintEdge(draggableObject);
    } else if (draggableObject instanceof SelectArea) {
      this.Palette.paintSelectArea(draggableObject);
    }
  }
}
