import React from 'react'
//import CheckboxFilter from './Filters/CheckboxFilter'
import TabFilter from './TabFilter'
//import SearchFilter from './Filters/SearchFilter'
//import DropdownFilter from './Filters/DropdownFilter'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {updateFilter, clearFilters, removeFilter} from '../../actions/filter-actions'

class FilterCreator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {page:this.props.page}
  }

  clickedUpdateFilter =  (filter, filterId) =>{
    this.props.handleUpdateFilter(this.state.page, filterId, filter)
  }

  componentWillUnmount() {
    this.props.handleClearFilters(this.state.page)
  }
  
  
  render() {
    const {filters } = this.props
    return (
      <div>
        {
          filters.map((filter,i) => {
            if (filter.type === 'checkbox')
            {
              return null
              // <CheckboxFilter
              //   updateMyRows={updateMyRows} 
              //   key={i} 
              //   checkboxes={filter.values} 
              //   rows={rows} 
              //   checkboxColumn={filter.column}/>
            }
            if (filter.type === 'tab')
            {
              return <TabFilter
                filterId={i}
                clickedUpdateFilter={this.clickedUpdateFilter}
                key={i} 
                displayType={filter.displayType}
                tabs={filter.values} 
                column={filter.column}
                defaultTab={filter.defaultTab}
                tabStyles={filter.tabStyles}/>
            }
            // if (filter.type === 'search')
            // {
            //   return <SearchFilter key={i}
            //     rows={rows} 
            //     column={filter.column} 
            //     passUpFilterInfo={passUpFilterInfo}
            //     updateMyRows={updateMyRows}/>
            // }
            // if (filter.type === 'dropdown')
            // {
            //   return <DropdownFilter key={i}
            //     passUpFilterInfo={passUpFilterInfo}
            //     updateMyRows={updateMyRows} 
            //     key={i} 
            //     dropdowns={filter.values} 
            //     rows={rows} 
            //     allInd={true}
            //     name={filter.name}
            //     column={filter.column}/>
            // }
          })
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleUpdateFilter: (page, filterId, filter) => dispatch(updateFilter(page, filterId, filter)),
  handleClearFilters: (page ) => dispatch(clearFilters(page)),
  handleRemoveFilter: (page, filterId) => dispatch(removeFilter(page, filterId))
})

export default compose(
  connect(null,
    mapDispatchToProps),
)(FilterCreator)