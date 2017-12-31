import React, { Component } from 'react'
import update from 'immutability-helper'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import SortableListItem from './SortableListItem'
import List from 'material-ui/List'

const style = {
  width: 400,
  root: {
    width: '100%',
    maxWidth: 360,
    position: 'absolute',
    overflow: 'auto',
    //maxHeight: 300,
  },
}

class SortableList extends Component {
	constructor(props) {
		super(props)
		this.moveOwner = this.moveOwner.bind(this)
	}

  moveOwner(dragIndex, hoverIndex) {
    const { owners } = this.props
    const dragOwner = owners[dragIndex]

    this.props.updateDraftOrder(
      update(this.props, {
        owners: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragOwner]],
        },
      }).owners,
    )
  }

  render() {
	  const { owners } = this.props

    return (
      <List style={style.root}>
        {owners.map((owner, i) => (
          <SortableListItem
            key={owner.id}
            index={i}
            id={owner.id}
            text={owner.text}
            moveCard={this.moveOwner}
          />
        ))}
      </List>
    )
  }
}

export default (DragDropContext(HTML5Backend)(SortableList))