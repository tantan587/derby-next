import { Fragment } from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import RosterGrid from '../RosterGrid'
import Title from '../../Navigation/Title'


const DraftRecapPage = ({ activeLeague }) => activeLeague.draftInfo.mode === 'post' ?
  <Fragment>
    <Title backgroundColor='#EBAB38' color='white' title='Draft Grid' />
    <RosterGrid />
  </Fragment> :
  <div style={{height:500}}>
    <div style={{
      marginTop:100,display:'flex', alignItems:'center', flexDirection:'column'}}>
      <Typography style={{ textAlign:'center'}}  variant='display1'>Draft is not yet finished.</Typography> :
      <Typography style={{marginTop:50, textAlign:'center'}} variant='display1'>This page is not currently available.</Typography>
    </div>
  </div>

export default connect(state => ({ activeLeague: state.activeLeague }))(DraftRecapPage)
