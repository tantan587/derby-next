import C from '../constants'

export const updateFilter = (page, filterId, filter ) => ({
  type: C.UPDATE_FILTER,
  page,
  filterId,
  filter,
})

export const clearFilters = (page) => ({
  type: C.CLEAR_FILTERS,
  page,
})

export const removeFilter = (page, filterId) => ({
  type: C.REMOVE_FILTER,
  page,
  filterId
})