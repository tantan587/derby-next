import { Fragment } from 'react'
import RosterGrid from '../RosterGrid'
import Title from '../../Navigation/Title'


const DraftRecapPage = () =>
  <Fragment>
    <Title backgroundColor='#EBAB38' color='white' title='Draft Grid' />
    <RosterGrid />
  </Fragment>

export default DraftRecapPage
