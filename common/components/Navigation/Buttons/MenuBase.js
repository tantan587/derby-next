import React from 'react'
import Button from 'material-ui/Button'
import Menu, { MenuItem } from 'material-ui/Menu'
import Link from 'next/link'

class SimpleMenu extends React.Component {
  state = {
    anchorEl: null,
    hoverIndex:-1
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  setHover = (hoverIndex) =>
  {
    this.setState({hoverIndex:hoverIndex})
  }

  handleClose = (id) => {
    const {handleClick} = this.props
    if (id && handleClick && typeof id === 'string')
      handleClick(id)
    this.setState({ anchorEl: null })
  };

  render() {
    const { anchorEl, hoverIndex } = this.state
    const {items, title, backgroundColor, color} = this.props
    return (
      <div style={{display:'inline'}}>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          disabled={items.length === 0}
          onClick={this.handleClick}
          style={{backgroundColor:backgroundColor, color: color}}
        >
          {title}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
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
        </Menu>
      </div>
    )
  }
}

export default SimpleMenu