import React from 'react'
import { withStyles } from '@material-ui/core/styles'
//import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
//import { Scrollbars } from 'react-custom-scrollbars'
import Grid from '@material-ui/core/Grid'



const styles = theme => ({
  container: {
    [theme.breakpoints.only('xl')]: {
      width: '25%'
    },
    [theme.breakpoints.only('lg')]: {
      width: '25%'
    },
    [theme.breakpoints.only('md')]: {
      width: '30%'
    },
    [theme.breakpoints.only('sm')]: {
      width: '40%'
    },
    [theme.breakpoints.only('xs')]: {
      width: '50%'
    },
  }
})

class SearchFilter extends React.Component {

  constructor(props, context) {
    super(props, context)

  }

  onTextChange = event => {

    //this.setState({ value: event.target.value })
    this.filterRows(event.target.value)
  }

  onPressSubmit = () =>{
    this.filterRows(this.state.value)
  }


  filterRows = word => {
    const {column, clickedUpdateFilter, filterId} = this.props
    clickedUpdateFilter({key:column, value:word, type:'search'}, filterId)
  }

  render() {
    const { classes } = this.props

    let localValue = this.props.value === '\n' ? '' : this.props.value
    localValue = localValue || ''
    return(
      <Grid container spacing={24} className={classes.container} style={{marginTop:10}}>
        <Grid item xs={12}>
          <Grid container alignItems='flex-end' direction='row'>
            <Grid item xs={10} sm={10}
              style={{backgroundColor:'white', }}>
              <TextField
                id="input1"
                style={{width:'100%'}}
                InputProps={{ disableUnderline: false}}
                onChange={this.onTextChange}
                placeholder="Search"
                value={localValue}
              />
            </Grid>
            <Grid item xs={1} sm={1} style={{marginLeft:-25}}>
              <IconButton style={{height:30, width:30, marginLeft:0}} onClick={this.onPressSubmit}>
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(SearchFilter)
