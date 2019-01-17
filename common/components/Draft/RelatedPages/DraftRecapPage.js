import { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { clickedEnterDraft } from '../../../actions/draft-actions'
import DraftResults from '../DraftResults'
import Title from '../../Navigation/Title'


class DraftRecapPage extends Component {
  state = {
    isLoading: true
  }

  componentDidMount() {
    this.props.clickedEnterDraft(
      this.props.activeLeague.room_id,
      this.props.activeLeague.my_owner_id
    ).then(() => this.setState({ isLoading: false }))

  }

  render() {
    const { activeLeague } = this.props
    const { isLoading } = this.state

    return (
      !isLoading ?
        activeLeague.draftInfo && activeLeague.draftInfo.mode === 'post' ?
          <Fragment>
            <Title backgroundColor='#EBAB38' color='white' title='Draft Grid' />
            <DraftResults />
          </Fragment> :
          <div style={{height:500}}>
            <div style={{
              marginTop:100,display:'flex', alignItems:'center', flexDirection:'column'}}>
              <Typography style={{ textAlign:'center'}}  variant='display1'>Draft is not yet finished.</Typography> :
              <Typography style={{marginTop:50, textAlign:'center'}} variant='display1'>This page is not currently available.</Typography>
            </div>
          </div> :
        <div style={{height:500}}>
          <div style={{
            marginTop:100,display:'flex', alignItems:'center', flexDirection:'column'}}>
            <Typography style={{ textAlign:'center'}}  variant='display1'>Draft is loading.</Typography> :
            <Typography style={{marginTop:50, textAlign:'center'}} variant='display1'>This page is not currently available.</Typography>
          </div>
        </div>
    )
  }
}

export default connect(state => ({ activeLeague: state.activeLeague, state }), { clickedEnterDraft })(DraftRecapPage)
