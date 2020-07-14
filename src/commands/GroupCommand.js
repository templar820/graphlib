import Command from './Command';

export default class GroupCommand extends Command {
  constructor(commands) {
    super();
    this.commands = commands;
  }

  do() {
    let res = true;
    this.commands.forEach(c => {
      if (!res || !c.do()) res = false;
    });
    return res;
  }

  undo() {
    let res = true;
    this.commands.forEach(c => {
      if (!res || !c.undo()) res = false;
    });
    return res;
  }
}
