export default class DrawingRules {
  // Node Options
  SelectedNodeColor = '#0057FF';

  NodeBackgroundColor = '#fff';

  NodeOutlineColor = 'rgb(0, 0, 0, 0.3)';

  PaintNodeFont = 'normal normal 28px Roboto';

  PaintNodeLineHeight = 32;

  PaintNodeTextAlign = 'left';

  PaintNodeFontColor = '#000';

  // Port Options

  SelectedEdgeColor = '#3399ff';

  PortBackgroundColor = '#999';

  DraggedPortColor = 'black';

  PortResultColor = 'green';

  PortErrorColor = 'red';

  // Edge Options
  SelectedEdgeColor = 'rgba(0, 87, 255, 0.7)';

  EdgeOutlineColor = 'rgba(0, 0, 0, 0.2)';

  PaintEdgeFont = 'normal normal 28px Roboto';

  PaintEdgeLineHeight = 32;

  PaintEdgeTextAlign = 'left';

  PaintEdgeFontColor = 'rgba(0, 0, 0, 0.5)';

  // PortalOptions
  PaintPortalOutline = '#CBE896';

  PaintPortalBackground = 'rgba(192, 250, 212, 1)';

  PaintPortalFont = 'normal normal 28px Roboto';

  PaintPortalLineHeight = 16;

  PaintPortalTextAlign = 'left';

  PaintPortalFontColor = 'rgba(0, 0, 0, 1)';

  getPaintNodeOptions(ctx, node) {
    ctx.fillStyle = this.NodeBackgroundColor;
    ctx.strokeStyle = (node.selected) ? this.SelectedNodeColor : this.NodeOutlineColor;
    ctx.lineWidth = 2;
  }

  getPaintNodeFontOptions(ctx) {
    ctx.font = this.PaintNodeFont;
    ctx.fillStyle = this.PaintNodeFontColor;
    ctx.textAlign = this.PaintNodeTextAlign;
    return this.PaintNodeLineHeight;
  }

  getPaintEdgeOptions(ctx, edge) {
    ctx.fillStyle = this.EdgeOutlineColor;
    ctx.strokeStyle = (edge.selected) ? this.SelectedEdgeColor : this.EdgeOutlineColor;
    ctx.lineWidth = 2;
  }

  getPaintEdgeFontOptions(ctx) {
    ctx.font = this.PaintEdgeFont;
    ctx.fillStyle = this.PaintEdgeFontColor;
    ctx.textAlign = this.PaintEdgeTextAlign;
    return this.PaintEdgeLineHeight;
  }

  getPaintPortalOptions(ctx) {
    ctx.lineWidth = 6;
    ctx.fillStyle = this.PaintPortalBackground;
    ctx.strokeStyle = this.PaintPortalOutline;
  }

  getPaintPortalFontOptions(ctx) {
    ctx.font = this.PaintPortalFont;
    ctx.fillStyle = this.PaintPortalFontColor;
    ctx.textAlign = this.PaintPortalTextAlign;
    return this.PaintPortalLineHeight;
  }

  getPaintActionOptions(ctx, action) {
    ctx.fillStyle = this.NodeBackgroundColor;
    ctx.strokeStyle = (action.selected) ? this.SelectedNodeColor : this.NodeOutlineColor;
    ctx.lineWidth = 2;
  }

  getPaintActionFontOptions(ctx) {
    ctx.font = this.PaintNodeFont;
    ctx.fillStyle = this.PaintNodeFontColor;
    ctx.textAlign = this.PaintNodeTextAlign;
    return this.PaintNodeLineHeight;
  }

  getHoveredPortOptions(ctx, port) {
    if (port.type !== 'point') {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
    } else {
      ctx.fillStyle = 'red';
    }
  }

  getPortOptons(ctx, port) {
    switch (port.type) {
    case 'super-top':
      this.getPaintPortalOptions(ctx);
      return;
    case 'point':
      ctx.strokeStyle = 'blue';
      ctx.fillStyle = 'blue';
      return;
    default:
      ctx.fillStyle = this.PortBackgroundColor;
    }
  }
}
