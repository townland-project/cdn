require('./character.json')
require('./room.json')
require('./phone.json')

const fs = require('fs'),
    path = require('path')

const OutDatabaseFileName = 'index.json'
const __dir = path.join(__dirname, '..', '..')
let __base = ''
let size = 0


function INCSize(file = __dir) {
    size += fs.statSync(file).size
}

function SetBaseURL() {
    return new Promise((resolve) => {
        const buffer = fs.readFileSync(path.join(__dir, 'CNAME'))
        const hostname = buffer.toString()
        __base = `https://${hostname}/`
        setTimeout(() => resolve(), 3000)
    })
}

function WriteDatabase(database) {
    fs.writeFileSync(path.join(__dir, OutDatabaseFileName), JSON.stringify(database))
}

SetBaseURL().then(() => {
    INCSize(path.join(__dir, 'character.json'))
    INCSize(path.join(__dir, 'room.json'))
    INCSize(path.join(__dir, 'phone.json'))

    WriteDatabase({
        "size": size,
        "item": {
            "character": `${__base}character.json`,
            "room": `${__base}room.json`,
            "phone": `${__base}phone.json`,
            "application": `${__base}application.json`
        }
    })
})