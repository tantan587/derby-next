import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import {MenuItem} from 'material-ui/Menu'
import DerbyTable from './DerbyTable'



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
  title : {
    textAlign : 'center'
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
    }
  }
  render() {
    const { classes, usePagination, myHeaders, myRows } = this.props

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <br/>
          {this.props.rosterTitle 
            ? <div>
              <TextField
                id={'select-owner'}
                select
                label="Select Owner"
                className={classes.textField}
                value={this.state.dropdown}
                onChange={this.handleUpdateDropdown()}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                //helperText="Please select your currency"
                margin="normal"
              >
                {this.props.owners.map(option => (
                  <MenuItem key={option.owner_name} value={option.owner_name}>
                    {option.owner_name === this.state.myOwnerName ? 'Me' : option.owner_name}
                  </MenuItem>
                ))}
              </TextField>
              <Typography className={classes.title} type="display1" style={{paddingTop:'20px'}}>
                {this.state.myOwnerName === this.state.dropdown ? 'My Roster' : this.state.dropdown + '\'s Roster'}
              </Typography>
            </div>
            : <Typography className={classes.title} type="display1">{this.props.title}</Typography>
          }
          <br/>
          <DerbyTable 
            usePagination={usePagination}
            rows={myRows}
            headers={myHeaders}/>
          <br/>
          <br/>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(DerbyTableContainer)