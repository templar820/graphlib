import Node from './GraphComponents/Node';
import Edge from './GraphComponents/Edge';
import CanvasPainterListener from './DrawingService/CanvasPainterListener';
import Action from './GraphComponents/Action';
import Portal from './GraphComponents/Portal';

export default class GraphService {
  // фунция подипсчик на изменения состояния графического редактора
  subscriber;

  constructor(canvasContainer, subscriber, commandFactory) {
    this.commandFactory = commandFactory;

    this.canvasPainter = new CanvasPainterListener(canvasContainer, this.onStateChange);
    this.subscriber = subscriber;
  }

  setObjects = (schema, selected) => {
    const elements = [];

    if (schema?.containers) {
      schema.containers.forEach(el => {
        elements.push(new Node({
          x: el.view.x,
          y: el.view.y,
          id: el.id,
          label: el.view.label,
          selected: selected.containers.includes(el.id),
        }));
      });
    }

    if (schema?.actions) {
      schema.actions.forEach(el => {
        elements.push(new Action({
          x: el.view.x,
          y: el.view.y,
          id: el.id,
          label: el.view.label,
          selected: selected.actions.includes(el.id),
        }));
      });
    }

    if (schema?.portals) {
      schema.portals.forEach(el => {
        elements.push(new Portal({
          x: el.view.x,
          y: el.view.y,
          id: el.id,
          label: el.view.label,
          selected: selected.portals.includes(el.id),
        }));
      });
    }
    if (schema?.actionMappers) {
      schema.actionMappers.forEach(el => {
        elements.push(new Edge({
          sourceId: el.sourceId,
          targetId: el.targetId,
          id: el.id,
          label: el.view.label,
          sourceType: el.view.sourceType,
          targetType: el.view.targetType,
          ports: el.view.ports,
          selected: selected.actionMappers.includes(el.id)
        }));
      });
    }

    if (schema?.uiMappers) {
      schema.uiMappers.forEach(el => {
        elements.push(new Edge({
          sourceId: el.sourceId,
          targetId: el.targetId,
          id: el.id,
          label: el.view.label,
          sourceType: el.view.sourceType,
          targetType: el.view.targetType,
          ports: el.view.ports,
          selected: selected.uiMappers.includes(el.id)
        }));
      });
    }

    console.log(elements);
    this.canvasPainter.render(elements);
  };

  onStateChange = (event, graphElements) => {
    console.log(event, graphElements);
    let command;
    const commands = [];
    switch (event) {
    case 'Select':
      command = this.commandFactory.CreateSelectCommand(graphElements);
      break;
    case 'Create':
      if (graphElements.length) {
        graphElements.forEach(ge => {
          console.log(ge);
          if (ge instanceof Node) {
            commands.push(this.commandFactory.CreateAddContainerCommand(ge));
          } else if (ge instanceof Action) {
            commands.push(this.commandFactory.CreateAddActionCommand(ge));
          } else if (ge instanceof Edge) {
            commands.push(this.commandFactory.CreateAddMapCommand(ge));
          } else if (ge instanceof Portal) {
            commands.push(this.commandFactory.CreateAddPortalCommand(ge));
          }
        });
      }
      command = this.commandFactory.CreateGroupCommand(commands);
      break;
    case 'UpdateActions':
      // todo Массвый апдейт стрелок. Это как?
      command = this.commandFactory.CreateUpdateMapCommand(graphElements[0]);
      // this.state.elements.forEach(element => {
      //   element.selected = false;
      //   graphElements.forEach(graphElement => {
      //     if (graphElement.id === element.id) {
      //       element.x = graphElement.x;
      //       element.y = graphElement.y;
      //       element.selected = true;
      //       element.sourceId = graphElement.sourceId;
      //       element.sourceType = graphElement.sourceType;
      //       element.targetId = graphElement.targetId;
      //       element.targetType = graphElement.targetType;
      //     }
      //   });
      // });
      break;
    case 'Delete':
      command = this.commandFactory.CreateDeleteCommand(graphElements);
      break;
    default:
      throw new Error('Unsuported command');
    }

    if (window.location.pathname === '/canvas') {
      this.canvasPainter.render(this.state.elements);
    } else if (command) this.subscriber(command);
  }
}
