import  { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'


//TODO:
//https://github.com/atlassian/react-beautiful-dnd/issues/219


const getItemStyle = (draggableStyle, isDragging) => ({

  userSelect: 'none',

  margin:10,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'lightgrey',

  // styles we need to apply on draggables
  ...draggableStyle,
})

export default class SortableList extends Component {
  constructor(props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
  }
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    this.props.updateOrder(result.source.index,result.destination.index)
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              style={{display:'flex', flexDirection:'column', alignItems:'center'}}
            >
              {this.props.items.map(item => (
                <Draggable key={item.id} draggableId={item.id}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        style={getItemStyle(
                          provided.draggableStyle,
                          snapshot.isDragging)}
                        {...provided.dragHandleProps}
                      >
                        {item.card}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}
