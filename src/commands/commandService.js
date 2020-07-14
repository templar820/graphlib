import { action, computed, observable } from 'mobx';
import Command from './Command';
import SelectCommand from './SelectCommand';

export default class CommandService {
  @observable
  commands = [];

  @observable
  undoCommands = [];

  @computed
  get canUndo() {
    return this.commands.length;
  }

  @computed
  get canRedo() {
    return this.undoCommands.length;
  }

  @action
  listenCommands = command => {
    console.log('command', command);
    if (command instanceof Command) {
      if (command.do()) {
        if (!(command instanceof SelectCommand)) this.commands.push(command);
        this.undoCommands = [];
      }
    } else {
      throw new Error('А зачем мы commandFactory вводили?');
    }
  };

  @action
  undo = () => {
    const command = this.commands.pop();
    if (command.undo()) this.undoCommands.push(command);
  };

  @action
  redo = () => {
    const command = this.undoCommands.pop();
    if (command.do()) this.commands.push(command);
  };
}
