import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import DerbyTable from './DerbyTable'
import DerbyTitle from './DerbyTitle'



const styles = theme => ({
})

class DerbyTableContainer extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      myRows : [],
      allRows : []
    }
  }

  componentWillMount() {
    this.updateMyRows(this.props.myRows)
    this.setState({allRows:this.props.myRows})
  }
  componentWillReceiveProps(nextProps) {
    this.updateMyRows(nextProps.myRows)
    this.setState({allRows:this.props.myRows})

  }
  updateMyRows = (rows) =>
  {
    this.setState({myRows:rows})
  }
  render() {
    const { usePagination, myHeaders, filters, openDialog } = this.props
    const {myRows, allRows} = this.state

    return (
      <div>
        <DerbyTitle
          title={this.props.title}
          updateMyRows={this.updateMyRows}
          rows={allRows}
          filters={filters ? filters : []}/>
        <br/>
        <br/>
        <DerbyTable
          openDialog={openDialog}
          usePagination={usePagination}
          rows={myRows}
          headers={myHeaders}/>
        <br/>
        <br/>
      </div>
    )
  }
}

export default withStyles(styles)(DerbyTableContainer)
