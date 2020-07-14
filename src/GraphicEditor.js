import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GraphService from './GraphLibNew/GraphService';
import {toJS} from "mobx";


export default class GraphicEditor extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.rules = [
      {
        action: 'Создать Ноду',
        description: 'Двойной клик по полотну'
      },
      {
        action: 'Убрать выделение',
        description: 'Нажать на пустое место'
      },
      {
        action: 'Выделить один элемент',
        description: 'Нажать на элемент'
      },
      {
        action: 'Удалить',
        description: 'Delete или BackSpace'
      },
      {
        action: 'Копировать',
        description: 'Ctrl+C'
      },
      {
        action: 'Вставить',
        description: 'Ctrl+V'
      },
    ];
  }

  componentDidMount() {
    this.service = new GraphService(this.ref?.current, this.props.onStateChange, this.props.commandFactory);
    this.service.setObjects(this.props.schema, this.props.selected);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log(toJS(nextProps.schema));
    this.service.setObjects(nextProps.schema, nextProps.selected);
    return false;
  }

  useStyles() {
    return makeStyles({
      root: {
        maxWidth: 345,
      },
      media: {
        height: 140,
      },
    });
  }

  render() {
    const classes = this.useStyles();
    return (
      <div ref={this.ref} style={{ width: '100%', height: '100%' }}>
        <Card
          className={classes.root}
          onKeyDown={e => { console.log(e); }}
          style={{ position: 'absolute', right: '0px', width: '300px' }}
        >
          <CardContent style={{ padding: '16px 0px 0px 0px' }}>
            <Typography gutterBottom variant="h5" component="h2" style={{ marginLeft: '16px' }}>
              Легенда
            </Typography>
            {/* <Typography variant="body2" color="textSecondary" component="p"> */}

            {/*  <TableContainer component={Paper}> */}
            {/*    <Table className={classes.table} aria-label="customized table"> */}
            {/*      <TableHead> */}
            {/*        <TableRow> */}
            {/*          <StyledTableCell align="center">Действие</StyledTableCell> */}
            {/*          <StyledTableCell align="center">Описание</StyledTableCell> */}
            {/*        </TableRow> */}
            {/*      </TableHead> */}
            {/*      <TableBody> */}
            {/*        {this.rules.map((el, index) => ( */}
            {/*          <StyledTableRow key={index}> */}
            {/*            <StyledTableCell align="right">{el.action}</StyledTableCell> */}
            {/*            <StyledTableCell align="right">{el.description}</StyledTableCell> */}
            {/*          </StyledTableRow> */}
            {/*        ))} */}
            {/*      </TableBody> */}
            {/*    </Table> */}
            {/*  </TableContainer> */}
            {/* </Typography> */}
          </CardContent>
        </Card>
      </div>
    );
  }
}
