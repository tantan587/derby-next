//TODO:
//https://github.com/atlassian/react-beautiful-dnd/issues/219
import { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Scrollbars } from 'react-custom-scrollbars'

const getItemStyle = (draggableStyle, marginBottom) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  //margin: `0 0 ${grid}px 0`,
  marginBottom,
  // styles we need to apply on draggables
  ...draggableStyle,
})

export default class SortableList extends Component {

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    this.props.updateOrder(result.source.index,result.destination.index)
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const {items, maxHeight} = this.props
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              style={{display:'flex', flexDirection:'column',maxHeight }}
            >
              <Scrollbars autoHide style={{ height: maxHeight }}>
                {items && items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          provided.draggableProps.style,
                          this.props.marginBottom
                        )}
                      >
                    
                        {item.card}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Scrollbars>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}
