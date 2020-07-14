import Command from './Command';
import ActionMapper from '../../../../model/SchemaBody/actionMapper';
import UiMapper from '../../../../model/SchemaBody/uiMapper';
import Action from '../../../../model/SchemaBody/action';
import Container from '../../../../model/SchemaBody/container';
import ViewEdge from '../../../../model/SchemaBody/viewEdge';

export default class UpdateMapCommand extends Command {
  newUiMap = null;

  newActionMap = null;

  oldUiMap = null;

  oldActionMap = null;

  constructor(addObjects, removeObjects, getObjects, node) {
    super();
    this.addObjects = addObjects;
    this.getObjects = getObjects;
    this.removeObjects = removeObjects;
    this.node = node;
  }

  do = () => {
    if (!this.newUiMap && !this.newActionMap) {
      const objects = this.getObjects();

      const sourceObj = objects.actions.find(a => a.id === this.node.sourceId)
          || objects.containers.find(a => a.id === this.node.sourceId);
      const targetObj = objects.actions.find(a => a.id === this.node.targetId)
          || objects.containers.find(a => a.id === this.node.targetId);

      if (sourceObj instanceof Container && targetObj instanceof Action) {
        this.oldActionMap = objects.actionMappers.find(o => o.id === this.node.id);
        this.newActionMap = new ActionMapper({
          id: this.node.id,
          sourceId: sourceObj.id,
          targetId: targetObj.id,
          view: new ViewEdge(this.node)
        });
        this.removeObjects({
          actionMappers: this.oldActionMap ? [this.oldActionMap.id] : [],
        });
        this.addObjects({
          actionMappers: [this.newActionMap],
        });
      } else if (sourceObj instanceof Action && targetObj instanceof Container) {
        this.oldUiMap = objects.uiMappers.find(o => o.id === this.node.id);
        this.newUiMap = new UiMapper({
          id: this.node.id,
          sourceId: sourceObj.id,
          targetId: targetObj.id,
          view: new ViewEdge(this.node)
        });
        this.removeObjects({
          uiMappers: this.oldUiMap ? [this.oldUiMap.id] : [],
        });
        this.addObjects({
          uiMappers: [this.newUiMap],
        });
      } else {
        alert('НЕкорректная стрелка');
        return false;
      }
    } else {
      this.removeObjects({
        uiMappers: this.oldUiMap ? [this.oldUiMap.id] : [],
        actionMappers: this.oldActionMap ? [this.oldActionMap.id] : [],
      });
      this.addObjects({
        uiMappers: this.newUiMap ? [this.newUiMap] : [],
        actionMappers: this.newActionMap ? [this.newActionMap] : [],
      });
    }

    return true;
  };

  undo = () => {
    this.removeObjects({
      uiMappers: this.newUiMap ? [this.newUiMap.id] : [],
      actionMappers: this.newActionMap ? [this.newActionMap.id] : [],
    });

    this.addObjects({
      uiMappers: this.oldUiMap ? [this.oldUiMap] : [],
      actionMappers: this.oldActionMap ? [this.oldActionMap] : [],
    });
    return true;
  }
}
