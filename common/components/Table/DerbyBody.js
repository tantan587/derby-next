import React from 'react'
import { connect } from 'react-redux'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { handleOpenDialog } from '../../actions/dialog-actions.js'
import { clickedOneTeam } from '../../actions/sport-actions.js'

const styles = {
  deeppadding :
  {
    padding: '5px 20px 5px 5px'
  },
  deepAlign :
  {
    textAlign: 'center'
  },
  deepbutton :
  {
    minHeight: 3,
    minWidth: 3,
    padding: '5px 10px'
  },
}

class DerbyBody extends React.Component {

  extraRowRender = (extraTableRow, i, n) =>
  {
    return <TableRow key={'round'+i}>
      <TableCell key={'round1'+i} colSpan={4} style={{color:'#269349', fontSize:16, fontWeight:'bold'}}>
        {extraTableRow.message + parseInt(n[extraTableRow.key])}
      </TableCell>
    </TableRow>
  }

  rowRender = (classes, columns, n) =>
  {
    const {handleOpenDialog, clickedOneTeam, activeLeague, styleProps} = this.props
    return (
      
      columns.filter(
        header => header.id !=='order').map(
        (header,i) =>
          <TableCell
            key={i}
            classes={{root: classes.deepAlign}}
            style={styleProps && styleProps.TableCell && styleProps.TableCell(i, n)}
            padding={header.disablePadding ? 'none' : 'default'}
            numeric={header.numeric}
            component={
              (styleProps && styleProps.TableCellComponent && styleProps.TableCellComponent(i, n)) ?
                styleProps.TableCellComponent.bind(null, i, n) : ''
            }
          >
            {header.imageInd === true && n[header.id] && n[header.id] !== 'none' 
              ?  <img src={n[header.id]} preserveAspectRatio='true'  style={{maxWidth:'40px', maxHeight:'40px'}}/>
              : header.button
                ? <Button
                  key={i}
                  disabled={header.button.disabled && n[header.button.disabled]}
                  classes={{root: classes.deepbutton}} // eslint-disable-line
                  style={{color:header.button.color,
                    backgroundColor:  header.button.disabled && n[header.button.disabled] ? header.button.disabledBackgroundColor : header.button.backgroundColor,
                    fontStyle: header.button.disabled && n[header.button.disabled] ? 'italic' :'normal',
                    fontSize:10, height:22, width:100}}
                  onClick={() => header.button.onClickOverride && n['onClickOverride'] ? n['onClickOverride'](n[header.id]) : header.button.onClick(n[header.id])}>
                  {header.button.labelOverride && n['labelOverride'] ? n['labelOverride'] : header.button.label}
                </Button>
                : header.id == 'team_name' && n['team_name'] !== 'none' ?
                  <div
                    onClick={() => {
                      handleOpenDialog(n)
                      clickedOneTeam(n.team_id, activeLeague.league_id)
                    }}
                  >
                    {n[header.id]}
                  </div>
                  : n[header.id]
            }
          </TableCell>
      )
    )
  }

  black

  render() {
    const { rows, columns, orderInd, classes, extraTableRow, styleProps } = this.props
    return(

      <TableBody style={styleProps && styleProps.TableBody}>
        {extraTableRow && rows.length > 0 ?
          this.extraRowRender(extraTableRow,-1,rows[0]) : null}
        {rows.map((n,i) => {
          return (
            [
              extraTableRow && n['pick'] % extraTableRow.freq === 1 && i !==0 ?
                this.extraRowRender(extraTableRow,i,n) : null,
              <TableRow
                hover
                tabIndex={-1}
                key={i}
                // style={i % 2 === 0 ? {} : { backgroundColor:'#d3d3d3' } }
                style={
                  styleProps &&
                  Object.assign(
                    {},
                    styleProps.TableRow,
                    i % 2 === 0 && styleProps.striped &&
                    { backgroundColor: (typeof styleProps.striped === 'string' && styleProps.striped) || '#d3d3d3' }
                  )
                }
              >
                {
                  [1].map(() =>
                  {
                    if(orderInd)
                      return <TableCell
                        key={'order'}
                        classes={{root: classes.deeppadding}}
                        style={styleProps && styleProps.TableCell && styleProps.TableCell()}
                        numeric
                      >
                        {i+1}
                      </TableCell>
                  })
                }
                {this.rowRender(classes, columns, n)}
              </TableRow>
            ]
          )
        })}
      </TableBody>
    )
  }
}

const mapStateToProps = state => ({
  activeLeague: state.activeLeague,
})

export default connect(
  mapStateToProps,
  { handleOpenDialog, clickedOneTeam }
)(withStyles(styles)(DerbyBody))
