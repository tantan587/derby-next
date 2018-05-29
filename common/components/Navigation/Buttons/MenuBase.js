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


  handleClose = (id) => {
    const {handleClick} = this.props
    if (id && handleClick && typeof id === 'string')
      handleClick(id)
    if (this.target1.contains(event.target)) {
      return
    }

    this.setState({ open: false })
  };

  setHover = (hoverIndex) =>
  {
    this.setState({hoverIndex:hoverIndex})
  }

  render() {
    const { classes, items, title, backgroundColor, color } = this.props
    const { open, hoverIndex } = this.state

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
            placement="bottom-start"
            eventsEnabled={open}
            className={classNames({ [classes.popperClose]: !open })}
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                <Paper>
                  <MenuList role="menu">
                    {items.map((item, i) => { 
                      return <MenuItem key={i} onClick={() => this.handleClose(item.id)}>
                        <Link href={item.link}>
                          <div
                            onMouseEnter={() => this.setHover(i)} 
                            onMouseLeave={() => this.setHover(-1)} 
                            style={{fontWeight:'bold',fontSize:14, color:hoverIndex===i?'#269349':'#555555'}}>{item.text}</div>                
                        </Link>
                      </MenuItem>
                    })
                    }
                  </MenuList>
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