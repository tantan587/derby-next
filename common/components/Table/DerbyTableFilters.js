import React from 'react'
import CheckboxFilter from './Filters/CheckboxFilter'
import TabFilter from './Filters/TabFilter'
import SearchFilter from './Filters/SearchFilter'

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
                tabs={filter.values} 
                rows={rows} 
                allInd={true}
                column={filter.column}
                tabColors={filter.tabColors}/>
            }
            if (filter.type === 'search')
            {
              return <SearchFilter key={i}
                rows={rows} 
                column={filter.column} 
                passUpFilterInfo={passUpFilterInfo}
                updateMyRows={updateMyRows}/>
            }
          })
        }
      </div>
    )
  }
}

export default DerbyTableFilters