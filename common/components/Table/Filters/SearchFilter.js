import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import SearchBar from 'material-ui-search-bar'



const styles = theme => ({
  button : {
    color:'black',
    borderRadius: '0px',
  },
  appBar : {
    height:'50px', 
    boxShadow: ['none']}
})

class SearchFilter extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: '',
    }
  }

  
  filterRows = word => {
    this.setState({
      value: word,
    })
    const {rows, column, updateMyRows, passUpFilterInfo} = this.props
    const localRows = word  ? rows.filter(row => row[column].toLowerCase().includes(word.toLowerCase())) : rows
    updateMyRows(localRows)
    if (passUpFilterInfo)
    {
      passUpFilterInfo({key:column, value:word, type:'search'})
    }
  }

  // filterRows = (index) => {
  //   const {rows, column, tabs, updateMyRows, passUpFilterInfo} = this.props

  //   const filter = index === tabs.length ? 0 : tabs[index]

  //   const localRows = filter ? rows.filter(row => row[column] === filter) : rows
  //   updateMyRows(localRows)
  //   if (passUpFilterInfo)
  //   {
  //     passUpFilterInfo({key:column, value:filter})
  //   }

  // }

  render() {
    return(
      <SearchBar
        onChange={this.filterRows}
        onRequestSearch={() => console.log('onRequestSearch')}
        value={this.state.value}
        style={{
          margin: 10,
          marginRight:'5%',
          float:'right',
          width:'30%',
          boxShadow: 'none',
          borderBottom: '0.1em solid #707070'

        }}
      />
    )
  }
}

export default withStyles(styles)(SearchFilter)