import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import  SortableList  from '../../SortableList'
import Grid from '@material-ui/core/Grid'
import {connect} from 'react-redux'
import OwnerSilk from '../../Icons/Avatars/OwnerSilk'
import Avatar from '@material-ui/core/Avatar'
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
})

const ReorderDraft = withStyles(styles)(class extends Component {

  Card = (classes, order, name, avatar) => {
    return <Card className={classes.card}>
      <Grid
        container
        alignItems="center">
        <Grid
          container
          item
          xs={4}
          alignItems="center"
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
    const { classes,owners} = this.props
    let cardList = owners.map((x,i) => {return {id:x.owner_name, card:
      this.Card(classes,(i+1),x.owner_name, x.avatar)}})
    return (
      <div>
        <SortableList items={cardList} updateOrder={this.props.onUpdateOrder} maxHeight={90*cardList.length} marginBottom={10}/>
      </div>
    )
  }
})

export default R.compose(
  withStyles(styles),
  connect(R.pick(['activeLeague'])),
)(ReorderDraft)

