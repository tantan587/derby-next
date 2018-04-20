import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import CheckboxFilter from './Filters/CheckboxFilter'
import TabFilter from './Filters/TabFilter'

const styles = () => ({
  title : {
    textAlign : 'center',
    color:'white',
    fontFamily:'HorsebackSlab',
    marginLeft:'3%'
  },
  appBar : {
    height:'55px', 
    boxShadow: ['none']}
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
        <AppBar position="static" 
          className={classes.appBar}
          style={{backgroundColor:'black'}}>
          <Toolbar>
            <Typography className={classes.title} type="display1">{myTitle}</Typography>
        
          </Toolbar>
        </AppBar>
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
            if (filter.type === 'tab')
            {
              return <TabFilter
                updateMyRows={updateMyRows} 
                key={i} 
                tabs={filter.values} 
                rows={rows} 
                allInd={true}
                column={filter.column}/>
            }
          })
        }
      </div>

    )
  }
}

export default withStyles(styles)(DerbyHeader)