import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
//import AddOfflineDraftForm from '../common/components/MainLeague/AddOfflineDraftForm'
import RouteProtector from '../common/components/RouteProtector'


class AddDraft extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector 
            ProtectedRoute={() => {}
              //<AddOfflineDraftForm />
            }
            previousPage={'add-draft'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(AddDraft))