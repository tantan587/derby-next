const Filterer = (data, filter, options) => {

  let rtnData = [].concat(data)

  switch (filter.type) {
  case 'tab': case 'dropdown':{
    rtnData = exclusiveFilter(rtnData, filter, options)
  }
    break
  case 'search': {
    rtnData = searchFilter(rtnData, filter, options)
  }
  }
  return rtnData
}

const exclusiveFilter = (data, filter, options) => {
  if (filter.value === 'All')
    return data
  if (filter.value === 'Mine')
    return data.filter(x => x['owner_name'] == options.ownerName)

  return data.filter(x => x[filter.key] == filter.value)
}

const searchFilter = (data, filter) => {
  return filter.value ? data.filter(row => row[filter.key].toLowerCase().includes(filter.value.toLowerCase())) : data
}

export default Filterer