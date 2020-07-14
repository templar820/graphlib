import AddContainerCommand from './AddContainerCommand';
import SelectCommand from './SelectCommand';
import DeleteCommand from './DeleteCommand';
import GroupCommand from './GroupCommand';
import AddMapCommand from './AddMapCommand';
import AddActionCommand from './AddActionCommand';
import UpdateMapCommand from './UpdateMapCommand';
import AddPortalCommand from "./AddPortalCommand";

export default class CommandFactory {
  constructor({
    addObjects, removeObjects, getObjects, setSelected, getSelected
  }) {
    this.addObjects = addObjects;
    this.removeObjects = removeObjects;
    this.setSelected = setSelected;
    this.getSelected = getSelected;
    this.getObjects = getObjects;
  }

  CreateAddContainerCommand = node => new AddContainerCommand(this.addObjects, this.removeObjects, node);

  CreateAddActionCommand = node => new AddActionCommand(this.addObjects, this.removeObjects, node);

  CreateSelectCommand = elements => new SelectCommand(this.setSelected, this.getSelected, this.getObjects, elements);

  CreateDeleteCommand = elements => new DeleteCommand(this.addObjects, this.removeObjects, this.getObjects, elements);

  CreateGroupCommand = commands => new GroupCommand(commands);

  CreateAddMapCommand = element => new AddMapCommand(this.addObjects, this.removeObjects, this.getObjects, element);

  CreateUpdateMapCommand =
          element => new UpdateMapCommand(this.addObjects, this.removeObjects, this.getObjects, element);

  CreateAddPortalCommand = element => new AddPortalCommand(this.addObjects, this.removeObjects, element);
}
