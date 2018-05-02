import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import { Scrollbars } from 'react-custom-scrollbars'

const styles = theme => ({
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: theme.palette.secondary.A100,
  },
  banner : {
    color: theme.palette.secondary[100],
    backgroundColor: theme.palette.primary[500],
  }
})

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

// using some little inline style helpers to make the app look okay
const grid = 10
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  //userSelect: 'none',
  // //padding: grid * 2,
  margin: `0px 20px ${grid}px ${grid}px`,

  height:40,
  // paddingTop:-10,

  // // change background colour if dragging
  // background: isDragging ? '#333333' : '#333333',
  backgroundColor: '#333333' ,
  // styles we need to apply on draggables
  ...draggableStyle,
})
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'black' : 'black',
  //padding: grid,
  //width: 250,
  margin:'auto'
})

export default class DraftQueue extends React.Component {

  constructor(props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onClose = (item) =>
  {
    const result = Array.from(this.props.items)
    const index = result.indexOf(item)
    result.splice(index, 1)
    this.props.updateOrder(result)
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = reorder(
      this.props.items,
      result.source.index,
      result.destination.index
    )

    this.props.updateOrder(items)
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const {items, teams} = this.props
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List style={{maxHeight: 290, overflow: 'auto'}}>
              <Scrollbars autoHide style={{ height: 290 }}>
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {items.map((item, i) => (
                    <Draggable key={item} draggableId={item}>
                      {(provided, snapshot) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={getItemStyle(
                              provided.draggableStyle,
                              snapshot.isDragging)}
                            {...provided.dragHandleProps}
                          >
                            <ListItem style={{display: 'flex'}}>
                              <ListItemText style={{marginTop:-15, padding:0, marginLeft:-15}} disableTypography primary=
                                {<Typography variant="body2" style={{ color: '#FFFFFF' }}>
                                  {(i+1) + '. ' + teams[item].team_name}
                                </Typography>}  />
                              <IconButton
                                key="close"
                                aria-label="Close"
                                style={{color:'white', marginTop:-15, marginLeft:-30, padding:0,marginRight:-30, float:'right'}}
                                //className={classes.close}
                                onClick={() => this.onClose(item)}
                              >
                                <CloseIcon style={{width:16,height:16}}/>
                              </IconButton>

                            </ListItem>
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Scrollbars>
            </List>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

// DraftQueue.propTypes = {
//   classes: PropTypes.object.isRequired,
// }

// export default withStyles(styles)(DraftQueue)