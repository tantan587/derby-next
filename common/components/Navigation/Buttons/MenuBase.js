import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Manager, Target, Popper } from 'react-popper'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import { withStyles } from '@material-ui/core/styles'
import Link from 'next/link'

const styles = theme => ({
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  popperClose: {
    pointerEvents: 'none',
  },
})

class MenuListComposition extends React.Component {
  state = {
    open: false,
    hoverIndex:-1
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open })
  };

  handleClose = () => {
    this.setState({ open: false })
  }

  handleCloseWithId = (id) => {
    const {handleClick} = this.props
    if (id && handleClick && typeof id === 'string')
      handleClick(id)

    this.handleClose()
  };

  setHover = (hoverIndex) =>
  {
    this.setState({hoverIndex:hoverIndex})
  }

  getMenuList = (items, n, hoverIndex) =>
  {
    return <MenuList role="menu" style={{display: 'inline-block' }}>
      {items.map((item, i) => { 
        return <MenuItem key={i} disabled={item.disabled} onClick={() => this.handleCloseWithId(item.id)}>
          <Link href={item.link ? item.link : 'nolink'}>
            <div
              onMouseEnter={() => this.setHover(i+n)} 
              onMouseLeave={() => this.setHover(-1)} 
              style={{fontWeight:'bold',fontSize:16, height:17, color:hoverIndex===i+n?'#269349':'#555555'}}>
              {item.text}</div>                
          </Link>
        </MenuItem>
      })
      }
    </MenuList>
  }

  render() {
    const { classes, items, items2, title, backgroundColor, color } = this.props
    const { open, hoverIndex } = this.state

    //this whole code is in order to make the two lists show up top aligned rather than bottome aligned
    if(items2)
    {
      if (items.length > items2.length)
      {
        let i 
        for(i = 0; i < items.length - items2.length; i++)
        {
          items2.push({disabled:true})
        }

      }
      else if (items.length < items2.length)
      {
        let i 
        for(i = 0; i < items2.length - items.length; i++)
        {
          items.push({disabled:true})
        }

      }
    }

    return (
      <div>
        <Manager>
          <Target>
            <div
              ref={node => {
                this.target1 = node
              }}
            >
              <Button
                aria-owns={open ? 'menu-list-grow' : null}
                aria-haspopup="true"
                onClick={this.handleToggle}
                style={{backgroundColor:backgroundColor, color: color, marginTop:-1}}
              >
                {title}
              </Button>
            </div>
          </Target>
          <Popper
            style={{zIndex:9999}}
            placement="bottom-start"
            eventsEnabled={open}
            className={classNames({ [classes.popperClose]: !open })}
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                <Paper>
                  {items2 ?
                    <div>
                      {this.getMenuList(items2,0, hoverIndex, true)}
                      <div style={{borderRight:'1px solid grey', display: 'inline-block', height:'240px'}}/>
                      {this.getMenuList(items,items2.length, hoverIndex)}
                    </div>
                    : 
                    this.getMenuList(items,0, hoverIndex)
                  }
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
      </div>
    )
  }
}

MenuListComposition.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MenuListComposition)