import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import  SortableList  from '../../SortableList'
import Grid from '@material-ui/core/Grid'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import OwnerSilk from '../../Icons/Avatars/OwnerSilk'
import Avatar from '@material-ui/core/Avatar'
//import {clickedCreateLeague, updateError} from '../../actions/fantasy-actions'
const R = require('ramda')

const styles = () => ({
  card:{
    height:80,
    width:300
  },
  silkContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  container: {
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    // height: 280,
    // padding: '6px 20px 20px 20px',
    // [theme.breakpoints.only('sm')]: {
    //   width: '75%',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   height: 400,
    // },
  },
})

const ReorderDraft = withStyles(styles)(class extends Component {
  constructor(props) {
    super(props)
    this.state = {

      owners:this.props.activeLeague.owners.sort((a,b) => a.draft_position > b.draft_position)
    }
  }

  onUpdateOrder= (start, end) => {

    let {owners} = this.state
    const [removed] = owners.splice(start, 1)
    owners.splice(end, 0, removed)
    this.setState({owners})
  }
  
  Card = (classes, order, name, avatar) => {
    return <Card className={classes.card}>
      <Grid
        container
        alignItems="center">
        <Grid
          container
          item
          xs={4}
          style={{display:'flex',  alignItems:'center', justifyContent:'center'}}
        >
          <div style={{marginLeft:-10, marginTop:0}}>
            <div className={classes.silkContainer}>
              <Avatar style={{ height: 80, width: 80, backgroundColor:'white' }}>
                { OwnerSilk(avatar, { height: 80, width: 80 }) }
              </Avatar>
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={8}
          children={order + '. ' + name}
          alignItems="center"
        />
      </Grid>
    </Card>
  }

  render() {
    const { classes } = this.props
    const {owners} = this.state
    let cardList = owners.map(x => {return {id:x.owner_name, card:
      this.Card(classes,(x.draft_position+1),x.owner_name, x.avatar)}})

    return (
      <SortableList items={cardList} updateOrder={this.onUpdateOrder}/>
    )
  }
})

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['activeLeague']), {}),
)(ReorderDraft)

