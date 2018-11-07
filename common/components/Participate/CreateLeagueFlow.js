import React from 'react'
import CreateLeagueForm from './CreateLeagueForm'
import ParticipateFlowContentWrapper from './ParticipateFlowContentWrapper'
//import ManageEmails from '../LeagueSettings/ManageLeague/ManageEmails'
import {connect} from 'react-redux'
import {makeProgress} from '../../actions/fantasy-actions'
import CustomizeTeam from  '../TeamSettings/CustomizeTeam/CustomizeTeam'
const R = require('ramda')
import Router from 'next/router'


class CreateLeagueFlow extends React.Component {


  updatePage = () => {
    const {progress} = this.props.user
    if (progress === 3)
      Router.push('/mainleaguehome')
    else
      this.props.onMakeProgress(this.props.user.progress + 1 )
  }

  componentWillMount() {
    this.props.onMakeProgress(1)
  }

  componentWillUnmount() {
    this.props.onMakeProgress(null)
  }

  render() {

    if(this.props.user.loggedIn === false){
      if (typeof document !== 'undefined'){
        Router.push('/login')
      }
      return(null)
    }
    
    const {progress} = this.props.user
    console.log(this.props.user)
    let component = null
    if(progress === 3)
    {
      let page3 = <ManageEmails updatePage={this.updatePage}/>
      component = <ParticipateFlowContentWrapper page={page3} title='Choose Friends'/>
    }
    else if(progress === 2)
    {
      let page2 =  <CustomizeTeam updatePage={this.updatePage}/>
      component = <ParticipateFlowContentWrapper page={page2} title='Customize Owner'/>
    }
    else if(progress === 1)
    {
      
      component = <CreateLeagueForm updatePage={this.updatePage}/>
    }

    return (
      component
    )
  }
}


export default R.compose(
  connect(R.pick(['user']), {onMakeProgress: makeProgress}),
)(CreateLeagueFlow)