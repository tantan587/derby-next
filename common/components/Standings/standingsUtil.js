// takes a list of users and finds the user with the most points
// takes the list of users and the 'most points' and shows the percent (number between 0 and 1)
// of how close they are to the leader (with the most points)

export const findMostPoints = owners => Math.max(...owners.map(owner => owner.total_points))
