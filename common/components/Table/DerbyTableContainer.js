import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import DerbyTable from './DerbyTable'
import DerbyTitle from './DerbyTitle'



const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 600,
    maxWidth: 1000
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  textField: {
    marginLeft: 40,//theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    float: 'left'
  },
  menu: {
    width: 200,
  },
})

class DerbyTableContainer extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      myRows : [],
      allRows : []
    }
  }

  componentWillMount() {
    this.updateMyRows(this.props.myRows)
    this.setState({allRows:this.props.myRows})
  }
  componentWillReceiveProps(nextProps) {
    this.updateMyRows(nextProps.myRows)
    this.setState({allRows:this.props.myRows})

  }
  updateMyRows = (rows) =>
  {
    this.setState({myRows:rows})
  }
  render() {
    const { classes, usePagination, myHeaders, filters } = this.props
    const {myRows, allRows} = this.state

    return (
      <Paper className={classes.root}>
        <br/>
        <br/>
        <DerbyTitle
          title={this.props.title}
          updateMyRows={this.updateMyRows}
          rows={allRows}
          filters={filters ? filters : []}/>
        <br/>
        <DerbyTable 
          usePagination={usePagination}
          rows={myRows}
          headers={myHeaders}/>
        <br/>
        <br/>
      </Paper>
    )
  }
}

export default withStyles(styles)(DerbyTableContainer)