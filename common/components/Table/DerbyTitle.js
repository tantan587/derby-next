import React from 'react'


import CheckboxFilter from './Filters/CheckboxFilter'
import TabFilter from './Filters/TabFilter'
import Title from '../Navigation/Title'


class DerbyHeader extends React.Component {
  
  constructor(props, context) {
    super(props, context)

    this.state = {
      myTitle : ''
    }
  }

  componentWillMount() {
    this.updateTitle(this.props.title)
  }
  updateTitle = (title) =>
  {
    this.setState({myTitle:title})
  }
  
  render() {
    const {filters, rows, updateMyRows } = this.props
    const {myTitle} = this.state
    
    return (
      <div>
        <Title color='white' backgroundColor='black' title={myTitle}/>
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
                column={filter.column}/>
            }
          })
        }
      </div>

    )
  }
}

export default DerbyHeader