const Filterer = (data, filters) => {
  if(!filters)
    return data

  let rtnData = [].concat(data)
  filters.map(filter => {

    switch (filter.type) {
    case 'tab':{
      rtnData = tabFilter(rtnData, filter)
    }}
    
  })
  return rtnData
}

const tabFilter = (data, filter) => {
  if (filter.value === 'All')
    return data
  return data.filter(x => x[filter.key] == filter.value)
}

export default Filterer