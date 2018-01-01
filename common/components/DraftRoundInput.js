import  { Component } from 'react'
import MenuItem from 'material-ui/Menu/MenuItem'
import TextField from 'material-ui/TextField'
import Table, {
  TableBody,
  TableCell,
  TableRow,
} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  text: {color:'black',
    marginLeft:'10%',
    marginRight:'10%',
    paddingTop :25,
    width: 150
    //float: 'left'
  },
  textField: {
    marginLeft: 10,//theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    //float :'left'
  },
  textFieldSmall: {
    marginLeft: 10,//theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 150,
    //float :'left'
  },
  menu: {
    width: 200,
  },
})

class DraftRoundInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sports:[],
      sportConf:[],
      sportTeams:[]
    }
  }

  handleChange = (name,i) => event => {
    let field = this.state[name]
    field[i] = event.target.value
    this.setState({
      [name]: field,
    })
  }

  componentWillMount() {
    this.setState({
      sports:Array(this.props.owners.length).fill(''),
      sportConf:Array(this.props.owners.length).fill(''),
      sportTeams:Array(this.props.owners.length).fill('')})
  }
  

  componentWillReceiveProps() {
    this.setState({
      sports:Array(this.props.owners.length).fill(''),
      sportConf:Array(this.props.owners.length).fill(''),
      sportTeams:Array(this.props.owners.length).fill('')})
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const {owners, sportLeagues, classes, teams} = this.props
    const {sports, sportConf, sportTeams} = this.state

    return (
      <Table>
        <TableBody>
          {owners.map((owner,i) =>
            <TableRow style={{height:100}} key={i}>
              <TableCell padding='none'>
                <Typography type="subheading" className={classes.text} gutterBottom>
                  {owner.text +':'} &nbsp; &nbsp; &nbsp;
                </Typography>
              </TableCell>
              <TableCell padding='none'>
                <TextField
                  id={'select-sport' +i}
                  select
                  label="Select Sport"
                  className={classes.textField}
                  value={sports[i] || ''}
                  onChange={this.handleChange('sports',i)}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  //helperText="Please select your currency"
                  margin="normal"
                >
                  {sportLeagues.map(option => (
                    <MenuItem key={option.league} value={option.league}>
                      {option.league}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell padding='none'>
                <TextField
                  id={'select-conference' +i}
                  select
                  label="Select Conference"
                  className={classes.textFieldSmall}
                  value={sportConf[i] || ''}
                  onChange={this.handleChange('sportConf',i)}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  //helperText="Please select your currency"
                  margin="normal"
                >
                  {sports[i] 
                    ? sportLeagues.filter(league => league.league === sports[i])[0].conferences.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))
                    : <div/>
                  }}
                </TextField>
              </TableCell>
              <TableCell padding='none'>
                <TextField
                  id={'select-team' +i}
                  select
                  label="Select Team"
                  className={classes.textField}
                  value={sportTeams[i] || ''}
                  onChange={this.handleChange('sportTeams',i)}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  //helperText="Please select your currency"
                  margin="normal"
                >
                  {teams.filter(team => team.sport === sports[i] 
                  && team.conference === sportConf[i]
                  && (!sportTeams.includes(team.team_id) 
                    || sportTeams[i] === team.team_id)).map(option => (
                    <MenuItem key={option.team_id} value={option.team_id}>
                      {option.team_name}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }
}

export default withStyles(styles)(DraftRoundInput)
