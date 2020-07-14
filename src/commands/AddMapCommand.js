import Command from './Command';
import ActionMapper from '../../../../model/SchemaBody/actionMapper';
import UiMapper from '../../../../model/SchemaBody/uiMapper';
import Action from '../../../../model/SchemaBody/action';
import Container from '../../../../model/SchemaBody/container';
import ViewEdge from '../../../../model/SchemaBody/viewEdge';
import Portal from "../../../../model/SchemaBody/portal";

export default class AddMapCommand extends Command {
  createdUiMap = null;

  createdActionMap = null;

  constructor(addObjects, removeObjects, getObjects, node) {
    super();
    this.addObjects = addObjects;
    this.removeObjects = removeObjects;
    this.getObjects = getObjects;
    this.node = node;
  }

  do = () => {
    if (!this.createdUiMap && !this.createdActionMap) {
      const objects = this.getObjects();
      const sourceObj = objects.actions.find(a => a.id === this.node.sourceId)
          || objects.containers.find(a => a.id === this.node.sourceId);
      const targetObj = objects.actions.find(a => a.id === this.node.targetId)
          || objects.containers.find(a => a.id === this.node.targetId) || objects.portals.find(a => a.id === this.node.targetId);
      if (sourceObj instanceof Container && targetObj instanceof Action) {
        this.createdActionMap = new ActionMapper({
          sourceId: sourceObj.id,
          targetId: targetObj.id,
          view: new ViewEdge(this.node)
        });
        this.addObjects({
          actionMappers: [this.createdActionMap],
        });
      } else if (sourceObj instanceof Action && (targetObj instanceof Container || targetObj instanceof Portal)) {
        this.createdUiMap = new UiMapper({
          sourceId: sourceObj.id,
          targetId: targetObj.id,
          view: new ViewEdge(this.node)
        });
        this.addObjects({
          uiMappers: [this.createdUiMap],
        });
      } else {
        alert('НЕкорректная стрелка');
      }
    } else {
      this.addObjects({
        uiMappers: this.createdUiMap ? [this.createdUiMap] : [],
        actionMappers: this.createdActionMap ? [this.createdActionMap] : [],
      });
    }

    return true;
  };

  undo = () => {
    this.removeObjects({
      uiMappers: this.createdUiMap ? [this.createdUiMap.id] : [],
      actionMappers: this.createdActionMap ? [this.createdActionMap.id] : [],
    });
    return true;
  }
}
