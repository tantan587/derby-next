

const knex = require('../../server/db/connection')

const test = () => {
    return knex
        .table('fdl')
        .select('*')
        .then((info)=>{
            let json_mapped = []
            json_mapped = info.map(i => i)
            return json_mapped
        })
}

test()
    .then(m=>{
        myJSON = JSON.stringify(m)
        console.log(myJSON)
        process.exit()
    })