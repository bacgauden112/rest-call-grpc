const client = require('./client')
const notes = client.list({}, (error, notes) => {
    if (!error) {
        return notes
    } else {
        console.error(error)
    }
})

module.exports.getNotes = notes