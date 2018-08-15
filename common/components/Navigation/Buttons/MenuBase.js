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

  handleCloseWithId = (id, onClick) => {

    const {handleClick} = this.props
    if (id && handleClick && typeof id === 'string')
      handleClick(id)

    onClick && onClick()

    this.handleClose()
  };

  setHover = (hoverIndex) =>
  {
    this.setState({hoverIndex:hoverIndex})
  }

  getMenuList = (items, n, hoverIndex) =>
  {
    return <MenuList role="menu" style={{display:'flex', flexDirection:'column'}}>
      {items.map((item, i) => { 
        return <MenuItem key={i} disabled={item.disabled} onClick={() => this.handleCloseWithId(item.id, item.onClick)}>
          <Link href={item.link ? item.link : '/'}>
            <div
              onClick={() => this.handleCloseWithId(item.id, item.onClick)}
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
    const { classes, items, extraItems, title, backgroundColor, color } = this.props
    const { open, hoverIndex } = this.state

    let items1 = items.concat([])
    let items2 = null
    //this whole code is in order to make the two lists show up top aligned rather than bottome aligned
    if(extraItems)
    {
      items2 = extraItems
      const howManyToAdd = Math.abs(items1.length - items2.length)
      let extraPaddding = new Array(howManyToAdd).fill({disabled:true})
      
      if(items1.length > items2.length) 
        items2 = items2.concat(extraPaddding) 
      else if(items2.length > items1.length)
      {
        items1=  items1.concat(extraPaddding)
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
                {title || ''}
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
                    <div style={{display:'flex', flexDirection:'row'}}>
                      {this.getMenuList(items2,0, hoverIndex, true)}
                      <div style={{borderRight:'1px solid grey'}}/>
                      {this.getMenuList(items1,items2.length, hoverIndex)}
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