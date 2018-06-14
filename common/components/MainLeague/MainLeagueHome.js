import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'

import { handleOpenDialog } from '../../actions/dialog-actions'
import silksAndColors from '../../../data/silksAndColors'

import DerbyTableContainer from '../Table/DerbyTableContainer'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import Title from '../Navigation/Title'
import Owner from '../Home/Owner'
import Card from '../Home/Card'
import Standings from '../Home/Cards/Standings'


const styles = {
  section1: {
    paddingTop: 100,
    color:'white',
    backgroundImage: 'url("/static/images/derbyhome2.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: '600px',
    marginLeft:'3%',
    width:'94%'
  },
  'cards': {
    display: 'flex',
    justifyContent: 'space-between',
    width: '90%',
    margin: '50px 5% 0px 5%'
  }
}

const HomeContainer = ({ className }) => <div className={className} />

class MainLeagueHome extends React.Component {


  render() {
    const { classes, activeLeague } = this.props

    let ownersWithColors = []
    if (activeLeague.owners) {
      ownersWithColors = activeLeague.owners.map((owner, i) => ({ ...owner, ...silksAndColors[i] }))
    }

    const myOwner = ownersWithColors.find(owner => owner.owner_id === activeLeague.my_owner_id)

    console.log(ownersWithColors)
    return (
      <div>
        <Title color='white' backgroundColor='black' title={'Welcome Us'}/>
        <div className={classes.section1}>
          {/* <div className={classes.section1}/> */}
          <Owner myOwner={myOwner} num={ownersWithColors.length} />
          <div className={classes.cards}>

            <Card title="Standings">
              <Standings owners={ownersWithColors.sort((a, b) => a.rank - b.rank)} />
            </Card>

            <Card title="Standings">
              <Standings owners={ownersWithColors.sort((a, b) => a.rank - b.rank)} />
            </Card>

            <Card title="Standings">
              <Standings owners={ownersWithColors.sort((a, b) => a.rank - b.rank)} />
            </Card>

          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openDialog: () => dispatch(handleOpenDialog)
})

// export default connect(
//   state => ({
//     activeLeague: state.activeLeague,
//     sportLeagues : state.sportLeagues,
//     teams: state.teams,
//   }),
//   mapDispatchToProps,
// )(withStyles(styles)(MainLeagueHome))
export default compose(
  connect(state => ({
    activeLeague: state.activeLeague,
    sportLeagues : state.sportLeagues,
    teams: state.teams,
  }),
  mapDispatchToProps),
  withStyles(styles)
)(MainLeagueHome)
