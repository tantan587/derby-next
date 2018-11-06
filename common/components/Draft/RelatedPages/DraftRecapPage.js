import { Fragment } from 'react'
import DraftResults from '../DraftResults'
import Title from '../../Navigation/Title'


const DraftRecapPage = () =>
  <Fragment>
    <Title backgroundColor='#EBAB38' color='white' title='Draft Recap' />
    <DraftResults />
  </Fragment>

export default DraftRecapPage
