import Command from './Command';

export default class SelectCommand extends Command {
  previousSelectedObject = null;

  constructor(setSelected, getSelected, getObjects, elements) {
    super();
    this.setSelected = setSelected;
    this.getSelected = getSelected;
    this.getObjects = getObjects;
    this.selectedObjects = elements;
  }

  do = () => {
    this.previousSelectedObject = this.getSelected();
    const selectedIds = this.selectedObjects.map(s => s.id);
    const objects = this.getObjects();
    const selected = {
      containers: (objects.containers || []).filter(c => selectedIds.includes(c.id)).map(c => c.id),
      actions: (objects.actions || []).filter(c => selectedIds.includes(c.id)).map(c => c.id),
      uiMappers: (objects.uiMappers || []).filter(c => selectedIds.includes(c.id)).map(c => c.id),
      actionMappers: (objects.actionMappers || []).filter(c => selectedIds.includes(c.id)).map(c => c.id),
      portals: (objects.portals || []).filter(c => selectedIds.includes(c.id)).map(c => c.id)
    };
    this.setSelected(selected);
    return true;
  };

  undo = () => {
    this.setSelected(this.previousSelectedObject);
    this.previousSelectedObject = null;
    return true;
  }
}
