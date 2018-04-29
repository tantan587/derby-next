import React from 'react'
import CheckboxFilter from './Filters/CheckboxFilter'
import TabFilter from './Filters/TabFilter'

class DerbyTableFilters extends React.Component {
  
  render() {
    const {filters, rows, updateMyRows } = this.props
    
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
                updateMyRows={updateMyRows} 
                key={i} 
                tabs={filter.values} 
                rows={rows} 
                allInd={true}
                column={filter.column}
                tabColors={filter.tabColors}/>
            }
          })
        }
      </div>
    )
  }
}

export default DerbyTableFilters