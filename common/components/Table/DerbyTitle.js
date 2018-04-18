import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import CheckboxFilter from './Filters/CheckboxFilter'

const styles = () => ({
  title : {
    textAlign : 'center'
  }
})
class DerbyHeader extends React.Component {
  
  constructor(props, context) {
    super(props, context)

    this.state = {
      myTitle : ''
    }
  }

  componentWillMount() {
    this.updateTitle(this.props.title)
  }
  updateTitle = (title) =>
  {
    this.setState({myTitle:title})
  }
  
  render() {
    const {classes, filters, rows, updateMyRows } = this.props
    const {myTitle} = this.state
    
    return (
      <div>
        <Typography className={classes.title} type="display1">{myTitle}</Typography>
        {
          filters.map((filter,i) => {
            if (filter.type === 'checkbox')
            {
              return <CheckboxFilter
                updateMyRows={updateMyRows} 
                key={i} 
                checkboxes={filter.values} 
                rows={rows} 
                checkboxColumn={filter.column}/>
            }
          })
        }
        {/* <CheckboxFilter/> */}
      </div>

    )
  }
}

export default withStyles(styles)(DerbyHeader)