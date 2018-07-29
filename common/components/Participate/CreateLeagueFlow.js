import React from 'react'
import CreateLeagueForm from './CreateLeagueForm'
import TeamOptions from './TeamOptions'
import {connect} from 'react-redux'
import {makeProgress} from '../../actions/fantasy-actions'
const R = require('ramda')


class CreateLeagueFlow extends React.Component {


  updatePage = () => {
    this.props.onMakeProgress(this.props.user.progress + 1 )
  }

  componentWillMount() {
    this.props.onMakeProgress(1)
  }

  componentWillUnmount() {
    this.props.onMakeProgress(null)
  }

  render() {
    const {progress} = this.props.user
    console.log(this.props.user)
    let component = null
    if(progress === 1)
    {
      component = <CreateLeagueForm updatePage={this.updatePage}/>
    }
    else if(progress === 2)
    {
      component = <TeamOptions updatePage={this.updatePage}/>
    }

    console.log(component)


    return (
      component
    )
  }
}


export default R.compose(
  connect(R.pick(['user']), {onMakeProgress: makeProgress}),
)(CreateLeagueFlow)