export default class Input {
  isShift = false;

  isControl = false;

  isLeftMouseButton = false;

  isRightMouseButton = false;

  topX = 0;

  topY = 0;

  wx = 0;

  wy = 0;

  downX = 0;

  downY = 0;

  upX = 0;

  upY = 0;

  lastX = 0

  lastY = 0;

  wheel = 0;

  scale = 0.5;

  isCopy = false;

  isPaste = false;

  isUndo = false;

  isRedo = false;

  readyToCreateNode = false;

  readyToCreatePortal = false;

  readyToCreateAction = false;

  isDelete = false;

  isAltKey = false;

  _y = 0;

  get y() {
    return (this._y - this.wy) / this.scale;
  }

  set y(value) {
    this._y = value;
  }

  _x = 0;

  get x() {
    return (this._x - this.wx) / this.scale;
  }

  set x(value) {
    this._x = value;
  }

  lastX=0;

  lastY=0;

  constructor(elem) {
    this.topX = elem.getBoundingClientRect().x;
    this.topY = elem.getBoundingClientRect().y;
  }

  panZoomCondition = () => this.isControl === true

  clickTimer;

  onClick = e => {
    if (e.detail === 1) {
      this.clickTimer = setTimeout(() => {
        this.clicked = true;
      }, 200);
    }
  }

  dblClickTimer;

  onDblclick = e => {
    clearTimeout(this.dblClickTimer);
    clearTimeout(this.clickTimer);
    this.dblClickTimer = setTimeout(() => {
      this.dblclicked = false;
    }, 10);
    this.dblclicked = true;
  }

  onMousedown = e => {
    if (e.which === 1) this.isLeftMouseButton = true;
    if (e.which === 3) this.isRightMouseButton = true;
    this.downX = e.clientX - this.topX;
    this.downY = e.clientY - this.topY;
  }

  onMouseOut = e => {
    this.onKeyup(e);
    this.isLeftMouseButton = false;
    this.isRightMouseButton = false;
  }

  onMouseup = e => {
    this.isLeftMouseButton = false;
    this.isRightMouseButton = false;
    this.upX = e.clientX - this.topX;
    this.upY = e.clientY - this.topY;
  }

  onMousemove = e => {
    this.x = e.clientX - this.topX;
    this.y = e.clientY - this.topY;

    if (this.panZoomCondition() === false) return false;

    if (this.isLeftMouseButton) {
      if (!this.dragged) {
        this.lastX = this._x;
        this.lastY = this._y;
        this.dragged = true;
      } else {
        this.wx += this._x - this.lastX;
        this.wy += this._y - this.lastY;
        this.lastX = this._x;
        this.lastY = this._y;
      }
    } else if (this.dragged) {
      this.dragged = false;
    }

    return undefined;
  }

  onKeydown = e => {
    if (e.key === 'Shift') this.isShift = true;
    if (e.ctrlKey || e.metaKey) this.isControl = true;
    if (e.altKey) this.isAltKey = true;

    if (this.isControl && e.code === 'KeyC') this.isCopy = true;
    if (this.isControl && e.code === 'KeyV') this.isPaste = true;

    if (this.isShift && e.code === 'KeyZ') this.readyToCreateNode = true;
    if (this.isShift && e.code === 'KeyX') this.readyToCreateAction = true;
    if (this.isShift && e.code === 'KeyC') this.readyToCreatePortal = true;

    if (e.key === 'Delete' || e.key === 'Backspace') this.isDelete = true;
  }

  onKeyup = e => {
    this.isShift = false;
    this.isControl = false;
    this.isAltKey = false;
    this.isCopy = false;
    this.isPaste = false;
    this.isDelete = false;
    this.readyToCreateNode = false;
    this.readyToCreateAction = false;
    this.readyToCreatePortal = false;
  }

  onWheel = e => {
    e.preventDefault();

    if (this.panZoomCondition() === false) return false;

    this.wheel += -e.deltaY;

    if (this.wheel !== 0) {
      let scale = 1;
      scale = this.wheel < 0 ? 1 / 1.01 : 1.01;
      this.wheel *= 0.8;
      if (Math.abs(this.wheel) < 1) {
        this.wheel = 0;
      }

      this.scale *= scale;
      this.wx = this._x - (this._x - this.wx) * scale;
      this.wy = this._y - (this._y - this.wy) * scale;
    }

    return undefined;
  }
}
