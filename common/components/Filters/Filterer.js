const Filterer = (data, filter, options) => {

  let rtnData = [].concat(data)

  switch (filter.type) {
  case 'tab': case 'dropdown':{
    rtnData = exclusiveFilter(rtnData, filter, options)
    break
  }
    
  case 'search': {
    rtnData = searchFilter(rtnData, filter)
    break
  }
  case 'checkbox': {
    rtnData = inclusiveFilter(rtnData, filter)
  }}
  return rtnData
}

const inclusiveFilter = (data, filter) => {
  let options = filter.value.filter(x => x.val).map(x => x.label)
  return data.filter(x => x[filter.key]===true || options.includes(x[filter.key]))
}

const exclusiveFilter = (data, filter, options) => {
  if (typeof filter.value === 'undefined' || filter.value === 'All')
    return data
  if (filter.value === 'My Teams')
    return data.filter(x => x['owner_name'] == options.ownerName)

  return data.filter(x => x[filter.key] == filter.value)
}

const searchFilter = (data, filter) => {
  return filter.value ? data.filter(row => row[filter.key].toLowerCase().includes(filter.value.toLowerCase())) : data
}

export default Filterer