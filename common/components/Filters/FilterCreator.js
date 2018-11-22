import React from 'react'
import CheckboxFilter from './CheckboxFilter'
import TabFilter from './TabFilter'
import SearchFilter from './SearchFilter'
import DropdownFilter from './DropdownFilter'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {updateFilter, clearFilters, removeFilter} from '../../actions/filter-actions'

class FilterCreator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      page: this.props.page,
      values: {}
    }
  }

  clickedUpdateFilter =  (filter, filterId) =>{
    const {values} = this.state
    values[filterId] = filter.value
    this.setState({values})
    this.props.handleUpdateFilter(this.state.page, filterId, filter)
  }

  removeFiltersBelow = (filterId, filtersToNotRemove) => {
    const {filters} = this.props
    const {values} = this.state
    for(let i = filterId +1; i < filters.length; i++) {
      if(!filtersToNotRemove || !filtersToNotRemove.includes(i)) {
        delete values[i]
        this.props.handleRemoveFilter(this.state.page, i)
      }
    }
    this.setState({values})
  }

  // componentWillUnmount() {
  //   this.props.handleClearFilters(this.state.page)
  // }


  render() {
    const {filters } = this.props
    const {values} = this.state
    return (
      <div>
        {
          filters.map((filter,i) => {

            if (filter.type === 'checkbox') {
              let value = values[i] || filter.values.map(x => {return {val:x.val, label:x.label}})
              return <CheckboxFilter
                clickedUpdateFilter={this.clickedUpdateFilter}
                filterId={i}
                key={i}
                value={value}
                column={filter.column}/>
            }

            if (filter.type === 'tab') {
              return <TabFilter
                filterId={i}
                removeFiltersBelow={this.removeFiltersBelow}
                clickedUpdateFilter={this.clickedUpdateFilter}
                filtersToNotRemove={filter.filtersToNotRemove}
                key={i}
                displayType={filter.displayType}
                tabs={filter.values}
                column={filter.column}
                defaultTab={filter.defaultTab}
                tabStyles={filter.tabStyles}/>
            }

            if (filter.type === 'search') {
              return <SearchFilter key={i}
                filterId={i}
                value={values[i]}
                column={filter.column}
                clickedUpdateFilter={this.clickedUpdateFilter}/>
            }

            if (filter.type === 'dropdown') {
              return <DropdownFilter key={i}
                value={values[i]}
                clickedUpdateFilter={this.clickedUpdateFilter}
                key={i}
                defaultValue={filter.defaultValue}
                displayFunction={filter.displayFunction || ((x) => x)}
                dropdowns={filter.values}
                filterId={i}
                name={filter.name}
                column={filter.column}/>
            }
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
