import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import DerbyTable from './DerbyTable'

const styles = () => ({
})

class DerbyTableContainer extends React.Component {

  render() {
    const { usePagination, myRows, myHeaders, openDialog, orderInd, extraTableRow, styleProps, noBreak } = this.props
    return (
      <div>
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
