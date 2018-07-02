import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import DerbyTable from './DerbyTable'
import DerbyTableFilters from './DerbyTableFilters'



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
    const { usePagination, myHeaders, filters, openDialog, passUpFilterInfo, orderInd, extraTableRow, styleProps, noBreak } = this.props
    const {myRows, allRows} = this.state
    return (
      <div>
        <DerbyTableFilters
          passUpFilterInfo={passUpFilterInfo}
          updateMyRows={this.updateMyRows}
          rows={allRows}
          filters={filters ? filters : []}/>
        { noBreak || <div> <br/> <br/></div> }
        <div  style={Object.assign({
          width:'100%',
          overflowX:'auto',
        }, styleProps && styleProps.Container)}>
          <DerbyTable
            openDialog={openDialog}
            usePagination={usePagination}
            rows={myRows}
            headers={myHeaders}
            orderInd={orderInd}
            extraTableRow={extraTableRow}
            styleProps={styleProps}
          />
        </div>
        <br/>
        <br/>
      </div>
    )
  }
}

export default withStyles(styles)(DerbyTableContainer)
