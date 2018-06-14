import Blocks from './Blocks'
import Chest from './Chest'
import Chevrons from './Chevrons'
import DiagonalQuartered from './DiagonalQuartered'
import Diamonds from './Diamonds'
import Dots from './Dots'
import Hoop from './Hoop'
import Sash from './Sash'

const chooseSilk = (ownerObj, style) => {

  switch(ownerObj.silk) {
  case 'Blocks':
    return <Blocks st1={ownerObj.color} style={style} />
  case 'Chest':
    return <Chest st1={ownerObj.color} style={style} />
  case 'Chevrons':
    return <Chevrons st1={ownerObj.color} style={style} />
  case 'DiagonalQuartered':
    return <DiagonalQuartered st1={ownerObj.color} style={style} />
  case 'Diamonds':
    return <Diamonds st1={ownerObj.color} style={style} />
  case 'Dots':
    return <Dots st1={ownerObj.color} style={style} />
  case 'Hoop':
    return <Hoop st1={ownerObj.color} style={style} />
  case 'Sash':
    return <Sash st1={ownerObj.color} style={style} />
  default:
    return ''
  }
}

export default chooseSilk
