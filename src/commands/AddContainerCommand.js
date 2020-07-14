import Command from './Command';
import Container from '../../../../model/SchemaBody/container';

export default class AddContainerCommand extends Command {
  createdContainer = null;

  constructor(addObjects, removeObjects, node) {
    super();
    this.addObjects = addObjects;
    this.removeObjects = removeObjects;
    this.node = node;
  }

  do = () => {
    if (!this.createdContainer) this.createdContainer = new Container({ view: this.node });
    this.addObjects({ containers: [this.createdContainer] });
    return true;
  };

  undo = () => {
    this.removeObjects({ containers: [this.createdContainer.id] });
    return true;
  }
}
