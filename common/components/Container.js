import React, { Component } from 'react'
import update from 'immutability-helper'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'

const style = {
	width: 400,
}

class Container extends Component {
	constructor(props) {
		super(props)
		this.moveOwner = this.moveOwner.bind(this)
		this.state = {
			cards: [
				{
					id: 1,
					text: 'Write a cool JS library',
				},
				{
					id: 2,
					text: 'Make it generic enough',
				},
				{
					id: 3,
					text: 'Write README',
				},
				{
					id: 4,
					text: 'Create some examples',
				},
				{
					id: 5,
					text:
						'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
				},
				{
					id: 6,
					text: '???',
				},
				{
					id: 7,
					text: 'PROFIT',
				},
			],
			owners : []
		}
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
      <div style={style}>
        {owners.map((owner, i) => (
          <Card
            key={owner.id}
            index={i}
            id={owner.id}
            text={owner.text}
            moveCard={this.moveOwner}
          />
        ))}
      </div>
    )
  }
}

export default (DragDropContext(HTML5Backend)(Container))