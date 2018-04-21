import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Link from 'next/link'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import '../styles/style.css'
import initStore from '../common/store'
import TopNavHome from '../common/components/Navigation/TopNavHome'
import SportIconText from '../common/components/Icons/SportIconText'

//https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet



const styles = {
  root: {
    textAlign: 'center',
    paddingTop: 100,
    backgroundColor:'#48311A',
    color:'white',
    //backgroundImage: 'url("/static/images/derbyhome.png")',
    //backgroundRepeat: 'no-repeat',
    //backgroundAttachment: 'fixed',
    //backgroundPosition: 'center',
    //backgroundSize: 'cover',
    minHeight: '600px',
    //fontFamily:'Tinos'
  }
}


class Index extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({
      open: false,
    })
  };

  handleClick = () => {
    this.setState({
      open: true,
    })
  };

  render() {
    const sports = [
      {name:'NFL', link:'/static/icons/sport_icon_football.svg'},
      {name:'NCAA', link:'/static/icons/sport_icon_football.svg'},
      {name:'MLB', link:'/static/icons/sport_icon_baseball.svg'},
      {name:'NBA', link:'/static/icons/sport_icon_basketball.svg'},
      {name:'NCAAM', link:'/static/icons/sport_icon_basketball.svg'},
      {name:'NHL', link:'/static/icons/sport_icon_hockey.svg'},
      {name:'EPL', link:'/static/icons/sport_icon_soccer.svg'}
    ]
    return (

      <div>
        <TopNavHome/>
        <div className={this.props.classes.root}>
          <Typography 
            type="display3" style={{color:'white'}}>
            <div style={{ fontFamily:'HorsebackSlab', display: 'inline'}}>
              {'Draft '}
            </div>
            <div style={{fontFamily:'museo-slab', display: 'inline'}}>
            Teams
            </div>
            <br/>
            <div style={{ fontFamily:'HorsebackSlab', display: 'inline'}}>
              {'Watch '}
            </div>
            <div style={{fontFamily:'museo-slab', display: 'inline'}}>
            Sports
            </div>
            <br/>
            <div style={{ fontFamily:'HorsebackSlab', display: 'inline'}}>
              {'Win '}
            </div>
            <div style={{fontFamily:'museo-slab', display: 'inline'}}>
            The Race
            </div>
          </Typography>
          <Typography type='headline'style={{color:'white',width:'50%', marginLeft:'25%'}}>
            Derby Fantasy Wins League is a new way to 
            play fantasy sports. Instead of drafting players,
            friends compete by drafting entire teams from multiple sports.
          </Typography>
          <br/>
          {
            sports.map((x,i) => { 
              return <SportIconText key={i} name={x.name} link={x.link} color='white'/>})
          }
          <br/>
          <br/>
          <Button style={{color:'white', backgroundColor:'#ebab38',height:50, width:125}}>
            <Link href="/signup">
              <div>
                signup
              </div>
            </Link>
          </Button>
        </div>
      </div>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRedux(initStore, null, null)(withRoot(withStyles(styles)(Index)))