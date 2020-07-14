import {
  action, observable, toJS
} from 'mobx';

import Container from '../../../model/SchemaBody/container';
import Action from "../../../model/SchemaBody/action";
import ActionMapper from "../../../model/SchemaBody/actionMapper";
import UiMapper from "../../../model/SchemaBody/uiMapper";
import Portal from "../../../model/SchemaBody/portal";

export default class SchemaEditorStore {
  constructor(updateData) {
    this.updateData = updateData;
  }

  @observable
  containers = [];

  @observable
  actions = [];

  @observable
  actionMappers = [];

  @observable
  uiMappers = [];

  @observable
  portals = [];

  @observable
  selected={
    containers: [],
    actions: [],
    actionMappers: [],
    uiMappers: [],
    portals: []
  };

  @action
  clearSelected() {
    this.selected = {
      containers: [],
      actions: [],
      actionMappers: [],
      uiMappers: [],
      portals: []
    };
  }

  @action
  init(content) {
    const {
      containers, actions, uiMappers, actionMappers, portals
    } = JSON.parse(content);
    this.containers = containers.map(c => new Container(c)) || [];
    this.actions = actions.map(c => new Action(c)) || [];
    this.actionMappers = actionMappers.map(c => new ActionMapper(c)) || [];
    this.uiMappers = uiMappers.map(c => new UiMapper(c)) || [];
    this.portals = portals.map(c => new Portal(c)) || [];
  }

  @action
  addObjects = ({
    containers, actions, uiMappers, actionMappers, portals
  }) => {
    if (containers && containers.length) {
      this.containers = [...this.containers, ...containers];
      this.selected.containers = containers.map(c => c.id);
    }
    if (actions && actions.length) {
      this.actions = [...this.actions, ...actions];
      this.selected.actions = actions.map(c => c.id);
    }
    if (uiMappers && uiMappers.length) {
      this.uiMappers = [...this.uiMappers, ...uiMappers];
      this.selected.uiMappers = uiMappers.map(c => c.id);
    }
    if (actionMappers && actionMappers.length) {
      this.actionMappers = [...this.actionMappers, ...actionMappers];
      this.selected.actionMappers = actionMappers.map(c => c.id);
    }
    if (portals && portals.length) {
      this.portals = [...this.portals, ...portals];
      this.selected.portals = portals.map(c => c.id);
    }

    this.updateData(this.getState());
  };

  @action
  removeObjects = ({
    containers, actions, uiMappers, actionMappers, portals
  }) => {
    if (containers) {
      this.containers = this.containers.filter(c => !containers.includes(c.id));
    }
    if (actions) {
      this.actions = this.actions.filter(c => !actions.includes(c.id));
    }
    if (uiMappers) {
      this.uiMappers = this.uiMappers.filter(c => !uiMappers.includes(c.id));
    }
    if (actionMappers) {
      this.actionMappers = this.actionMappers.filter(c => !actionMappers.includes(c.id));
    }
    if (portals) {
      this.portals = this.portals.filter(c => !portals.includes(c.id));
    }

    this.clearSelected();

    this.updateData(this.getState());
  };

  @action
  setSelected = selected => {
    this.selected = selected;
  };

  getState() {
    return JSON.stringify({
      containers: toJS(this.containers),
      actions: toJS(this.actions),
      actionMappers: toJS(this.actionMappers),
      uiMappers: toJS(this.uiMappers),
      portals: toJS(this.portals),
    });
  }

  getSelected = () => this.selected;

  getObjects = () => ({
    containers: this.containers,
    actions: this.actions,
    actionMappers: this.actionMappers,
    uiMappers: this.uiMappers,
    portals: this.portals
  });
}
