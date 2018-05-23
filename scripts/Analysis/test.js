const teamFunction = (number) => {
    return number*2
}

const test = {
    1: teamFunction
}

console.log(test[1](5))