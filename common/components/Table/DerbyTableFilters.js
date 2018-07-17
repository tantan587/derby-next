import React from 'react'
import CheckboxFilter from './Filters/CheckboxFilter'
import TabFilter from './Filters/TabFilter'
import SearchFilter from './Filters/SearchFilter'
import DropdownFilter from './Filters/DropdownFilter'

class DerbyTableFilters extends React.Component {
  
  render() {
    const {filters, rows, updateMyRows, passUpFilterInfo } = this.props
    return (
      <div>
        {
          filters.map((filter,i) => {
            if (filter.type === 'checkbox')
            {
              return <CheckboxFilter
                updateMyRows={updateMyRows} 
                key={i} 
                checkboxes={filter.values} 
                rows={rows} 
                checkboxColumn={filter.column}/>
            }
            if (filter.type === 'tab')
            {
              return <TabFilter
                passUpFilterInfo={passUpFilterInfo}
                updateMyRows={updateMyRows} 
                key={i} 
                sportInd={filter.sportInd}
                tabs={filter.values} 
                rows={rows} 
                allInd={filter.allInd}
                myOwnerName={filter.myOwnerName}
                column={filter.column}
                defaultTab={filter.defaultTab}
                tabStyles={filter.tabStyles}/>
            }
            if (filter.type === 'search')
            {
              return <SearchFilter key={i}
                rows={rows} 
                column={filter.column} 
                passUpFilterInfo={passUpFilterInfo}
                updateMyRows={updateMyRows}/>
            }
            if (filter.type === 'dropdown')
            {
              return <DropdownFilter key={i}
                passUpFilterInfo={passUpFilterInfo}
                updateMyRows={updateMyRows} 
                key={i} 
                dropdowns={filter.values} 
                rows={rows} 
                allInd={true}
                name={filter.name}
                column={filter.column}/>
            }
          })
        }
      </div>
    )
  }
}

export default DerbyTableFilters