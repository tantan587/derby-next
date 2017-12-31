import  { Component } from 'react'
import MenuItem from 'material-ui/Menu/MenuItem'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  text: {color:'black',
    marginLeft:'10%',
    marginRight:'10%',
    paddingBottom:30
    //float: 'left'
  },
  textField: {
    marginLeft: 10,//theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
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
      sportTeams:Array(this.props.owners.length).fill('')})
  }
  

  componentWillReceiveProps() {
    this.setState({
      sports:Array(this.props.owners.length).fill(''),
      sportTeams:Array(this.props.owners.length).fill('')})
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const {owners, sportLeagues, classes, teams} = this.props
    const {sports, sportTeams} = this.state
    return (
      <div>
        {owners.map((owner,i) =>
          <div style={{height:100}}>
            <Typography type="subheading" className={classes.text} gutterBottom>
              {owner.text +':'} &nbsp; &nbsp; &nbsp;
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
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
                {teams.filter(team => team.sport === sports[i]).map(option => (
                  <MenuItem key={option.team_name} value={option.team_name}>
                    {option.team_name}
                  </MenuItem>
                ))}
              </TextField>
            </Typography>
            <br/> 
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(DraftRoundInput)
