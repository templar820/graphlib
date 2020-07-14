import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import GraphService from './GraphLibNew/GraphService';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default class GraphicEditorOnlyCanvas extends React.Component {
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
    this.service = new GraphService(this.ref?.current, this.props.onStateChange);
    // this.service.setObjects(this.props.draft.body);
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
            <Typography variant="body2" color="textSecondary" component="p">

              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Действие</StyledTableCell>
                      <StyledTableCell align="center">Описание</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.rules.map((el, index) => (
                      // TODO: сделать уникальный индекс
                      <StyledTableRow key={Math.random()}>
                        <StyledTableCell align="right">{el.action}</StyledTableCell>
                        <StyledTableCell align="right">{el.description}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}
