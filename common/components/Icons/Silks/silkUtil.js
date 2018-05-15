import Blocks from './Blocks'
import Chest from './Chest'
import Chevrons from './Chevrons'
import DiagonalQuartered from './DiagonalQuartered'
import Diamonds from './Diamonds'
import Dots from './Dots'
import Hoop from './Hoop'
import Sash from './Sash'

const chooseSilk = (ownerObj) => {
  switch(ownerObj.silk) {
  case 'Blocks':
    return <Blocks st1={ownerObj.color} />
  case 'Chest':
    return <Chest st1={ownerObj.color} />
  case 'Chevrons':
    return <Chevrons st1={ownerObj.color} />
  case 'DiagonalQuartered':
    return <DiagonalQuartered st1={ownerObj.color} />
  case 'Diamonds':
    return <Diamonds st1={ownerObj.color} />
  case 'Dots':
    return <Dots st1={ownerObj.color} />
  case 'Hoop':
    return <Hoop st1={ownerObj.color} />
  case 'Sash':
    return <Sash st1={ownerObj.color} />
  default:
    return ''
  }
}

export default chooseSilk
