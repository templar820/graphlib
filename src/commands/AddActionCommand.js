import Command from './Command';
import Action from '../../../../model/SchemaBody/action';

export default class AddActionCommand extends Command {
  createdAction = null;

  constructor(addObjects, removeObjects, node) {
    super();
    this.addObjects = addObjects;
    this.removeObjects = removeObjects;
    this.node = node;
  }

  do = () => {
    if (!this.createdAction) this.createdAction = new Action({ view: this.node });
    this.addObjects({ actions: [this.createdAction] });
    return true;
  };

  undo = () => {
    this.removeObjects({ actions: [this.createdAction.id] });
    return true;
  }
}
