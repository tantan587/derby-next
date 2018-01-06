import  { Component } from 'react'
import MenuItem from 'material-ui/Menu/MenuItem'
import TextField from 'material-ui/TextField'
import Table, {
  TableBody,
  TableCell,
  TableRow,
} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
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

  render() {
    const {round, owners, sportLeagues, classes, teams, allTeamsDrafted, ownerConferences} = this.props
    const {sports, sportConf, sportTeams} = this.state

    return (
      <div>
        <Table>
          <TableBody>
            {owners.map((owner) =>
              <TableRow style={{height:100}} key={owner.order}>
                <TableCell padding='none'>
                  <Typography type="subheading" className={classes.text} gutterBottom>
                    {owner.text +':'} &nbsp; &nbsp; &nbsp;
                  </Typography>
                </TableCell>
                <TableCell padding='none'>
                  <TextField
                    id={'select-sport' +owner.order}
                    select
                    label="Select Sport"
                    className={classes.textField}
                    value={sports[owner.order] || ''}
                    onChange={this.handleChange('sports',owner.order)}
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
                    id={'select-conference' +owner.order}
                    select
                    label="Select Conference"
                    className={classes.textFieldSmall}
                    value={sportConf[owner.order] || ''}
                    onChange={this.handleChange('sportConf',owner.order)}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    //helperText="Please select your currency"
                    margin="normal"
                  >
                    {sports[owner.order] 
                      ? sportLeagues.filter(league => 
                        league.league === sports[owner.order])[0].conferences
                        .filter(conf => !ownerConferences[owner.order].map(x => x.conference_id).includes(conf.conference_id)
                        )
                        .map(option => (
                          <MenuItem key={option.conference_id} value={option.conference_id}>
                            {option.conference}
                          </MenuItem>
                        ))
                      : <div/>
                    }}
                  </TextField>
                </TableCell>
                <TableCell padding='none'>
                  <TextField
                    id={'select-team' +owner.order}
                    select
                    label="Select Team"
                    className={classes.textField}
                    value={sportTeams[owner.order] || ''}
                    onChange={this.handleChange('sportTeams',owner.order)}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    //helperText="Please select your currency"
                    margin="normal"
                  >
                    {teams.filter(team => team.sport === sports[owner.order] 
                    && team.conference_id === sportConf[owner.order]
                    && allTeamsDrafted.filter(otherTeams => otherTeams.team_id === team.team_id).length === 0
                    && (!sportTeams.includes(team.team_id) 
                      || sportTeams[owner.order] === team.team_id)).map(option => (
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
        {
          round > 1 ?  
            <div>  
              <Button raised className={classes.button}  onClick={() => this.props.onRoundBackward(round)}>
                Previous Round
              </Button> 
              <Button raised className={classes.button} style={{marginLeft:'20px'}} onClick={() => this.props.onRoundForward(round, sportConf, sportTeams)}>
                Next Round
              </Button>    
            </div>
            : <Button raised className={classes.button} onClick={() => this.props.onRoundForward(round, sportConf, sportTeams)}>
              Next Round
            </Button>  
        }
      </div>

    )
  }
}

export default withStyles(styles)(DraftRoundInput)
