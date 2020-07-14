import Command from './Command';
import Portal from '../../../../model/SchemaBody/portal';

export default class AddPortalCommand extends Command {
  createdPortal = null;

  constructor(addObjects, removeObjects, node) {
    super();
    this.addObjects = addObjects;
    this.removeObjects = removeObjects;
    this.node = node;
  }

  do = () => {
    if (!this.createdPortal) this.createdPortal = new Portal({ view: this.node });
    this.addObjects({ portals: [this.createdPortal] });
    return true;
  };

  undo = () => {
    this.removeObjects({ portals: [this.createdPortal.id] });
    return true;
  }
}
