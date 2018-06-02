import Blocks from './Blocks'
import Chest from './Chest'
import Chevrons from './Chevrons'
import DiagonalQuartered from './DiagonalQuartered'
import Diamonds from './Diamonds'
import Dots from './Dots'
import Hoop from './Hoop'
import Sash from './Sash'

const chooseHorse = (ownerObj, style) => {
  switch(ownerObj.silk) {
  case 'Blocks':
    return <Blocks st0={ownerObj.color} style={style} />
  case 'Chest':
    return <Chest st0={ownerObj.color} style={style} />
  case 'Chevrons':
    return <Chevrons st0={ownerObj.color} style={style} />
  case 'DiagonalQuartered':
    return <DiagonalQuartered st0={ownerObj.color} style={style} />
  case 'Diamonds':
    return <Diamonds st0={ownerObj.color} style={style} />
  case 'Dots':
    return <Dots st0={ownerObj.color} style={style} />
  case 'Hoop':
    return <Hoop st0={ownerObj.color} style={style} />
  case 'Sash':
    return <Sash st0={ownerObj.color} style={style} />
  default:
    return ''
  }
}

export default chooseHorse
