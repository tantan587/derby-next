import React from 'react'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
//import ReorderIcon from '@material-ui/icons/Reorder'
//import { Scrollbars } from 'react-custom-scrollbars'
import SortableList from '../SortableList'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import SportIcon from '../Icons/SportIcon'
import ContainerDimensions from 'react-container-dimensions'


export default class DraftQueue extends React.Component {

  onClose = (item) =>
  {
    const result = Array.from(this.props.items)
    const index = result.indexOf(item)
    result.splice(index, 1)
    this.props.updateOrder(result)
  }

  onUpdateOrder= (start, end) => {

    let {items} = this.props
    const [removed] = items.splice(start, 1)
    items.splice(end, 0, removed)
    this.props.updateOrder(items) 
  }

  Card = (team,item) => {
    return (
      <Card style={{height: 40, width:'90%', marginLeft:'5%',  backgroundColor:'#555555'}}>
        <ContainerDimensions>
          { ({width}) => 
          {return <Grid container style={{flexGrow:1, height:'100%'}}>
            <Grid item xs={12}>
              <Grid
                container
                style={{height:'100%'}}
                alignItems={'center'}
                direction={'row'}
                justify={'flex-start'}
              >
                <Grid item xs={2}>
                  {/* <ReorderIcon style={{width:'auto',height:20, marginTop:3, color:'white'}}/> */}
                  <SportIcon sportId={team.sport_id} style={{width:'auto', height:20}} color='white'/>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" style={{ color: '#FFFFFF', 
                    fontSize:team.team_name.length > 13 ? team.team_name.length > 22 ? width*0.05 : width*0.06 :  width*0.08,}}>
                    {team.team_name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <CloseIcon onClick={() => this.onClose(item)} style={{width:16,height:16,marginTop:4, color:'white'}}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          }}
        </ContainerDimensions>

      </Card>)
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const {items, teams} = this.props
    let queueList = items ? items.map((item) => {return {id:item, card:
      this.Card(teams[item],item)}}) : []
    return (
      <div style={{maxHeight:290, marginTop:10}}>
        <SortableList items={queueList} updateOrder={this.onUpdateOrder} maxHeight={290} marginBottom={10}/> 
      </div>
      
    )
  }
}
      
