import Command from './Command';

export default class DeleteCommand extends Command {
  objects = null;

  constructor(addObjects, removeObjects, getObjects, deletedObjects) {
    super();
    this.removeObjects = removeObjects;
    this.deletedObjects = deletedObjects;
    this.getObjects = getObjects;
    this.addObjects = addObjects;
  }

  do = () => {
    if (!this.objects) {
      const objects = this.getObjects();
      const deletedIds = this.deletedObjects.map(o => o.id);
      this.objects = {
        containers: (objects.containers || []).filter(c => deletedIds.includes(c.id)),
        actions: (objects.actions || []).filter(c => deletedIds.includes(c.id)),
        uiMappers: (objects.uiMappers || []).filter(c => deletedIds.includes(c.id)
          || deletedIds.includes(c.sourceId) || deletedIds.includes(c.targetId)),
        actionMappers: (objects.actionMappers || []).filter(c => deletedIds.includes(c.id)
            || deletedIds.includes(c.sourceId) || deletedIds.includes(c.targetId))
      };
    }
    this.removeObjects({
      containers: this.objects.containers.map(c => c.id),
      actions: this.objects.actions.map(c => c.id),
      uiMappers: this.objects.uiMappers.map(c => c.id),
      actionMappers: this.objects.actionMappers.map(c => c.id)
    });
    return true;
  };

  undo = () => {
    this.addObjects(this.objects);
    return true;
  }
}
