const mongoos = require('mongoose')
const url = process.env.MONGOOS_URL

mongoos.connect(url)
    .then(() => {
        console.log(`MongoDB Connected.`)
    })
    .catch((error) => {
        console.error(`MongoDB Not Connected`, error)
    })