import React from 'react';
import './index.css';
import { inject, observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import GraphicEditor from './GraphicEditor';
import CommandFactory from './commands/commandFactory';
import CommandService from './commands/commandService';
import SchemaEditorStore from './SchemaEditor.store';

class SchemaEditor extends React.Component {
  constructor(props) {
    super(props);

    this.store = new SchemaEditorStore(props.updateData);
    this.commandFactory = new CommandFactory(this.store);
    this.commandService = new CommandService();

    this.store.init(props.content || {
      containers: [], actions: [], uiMappers: [], actionMappers: []
    });
  }

  render() {
    return (
      <div className="dev">
        <div className="header">
          <Button onClick={this.commandService.undo} disabled={!this.commandService.canUndo}>
            Undo
          </Button>
          <Button onClick={this.commandService.redo} disabled={!this.commandService.canRedo}>
            Redo
          </Button>
        </div>
        <div className="main">
          <div className="panel center">
            <GraphicEditor
              schema={this.store}
              selected={this.store.selected}
              onStateChange={this.commandService.listenCommands}
              commandFactory={this.commandFactory}
            />
          </div>
          {/* Test */}
          <div style={{ height: '100%', width: '300px' }} />
        </div>
      </div>
    );
  }
}

export default SchemaEditor;
