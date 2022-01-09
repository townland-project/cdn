const fs = require('fs'),
    path = require('path')

const ImageExt = ['.png', '.jpg', '.svg', '.gif']
const OutDatabaseFileName = 'character.json'
const __dir = path.join(__dirname, '..', '..')
let __base = ''
let database = {
    "size": 0,
    "item": {}
}

function SetBaseURL() {
    return new Promise((resolve) => {
        const buffer = fs.readFileSync(path.join(__dir, 'CNAME'))
        const hostname = buffer.toString()
        __base = `https://${hostname}/`
        resolve()
    })
}

function INCSize(file = __dir) {
    database.size += fs.statSync(file).size
}

function IsImage(file = __dir) {
    let ext = path.extname(file)
    return ImageExt.includes(ext)
}

function GenerateKeyFromFileName(file = '') {
    let split = file.split('')
    split[0] = split[0].toLowerCase() // lower case first character
    // lower case upper cased character
    for (const i in split) {
        if (split[i].match('[A-Z]'))
            split[i] = `-${split[i].toLowerCase()}`

    }
    // remove ext from key
    let i = split.indexOf('.')
    split.splice(i, split.length)
    return split.join('')
}

function GetFileURL(base = '') {
    return `${__base}${base}`
}

async function ProccessOnFile(file = __dir) {
    if (IsImage(file)) {
        INCSize(file)
        let fileBaseDir = file.replace(__dir + '/', '')
        let fileBaseDirSplit = fileBaseDir.split('/')
        let fileName = path.basename(file)
        let fileNameKey = GenerateKeyFromFileName(fileName)
        // key = gender:dress:fileNameKey
        let key = `${fileBaseDirSplit[0]}:${fileBaseDirSplit[1]}:${fileNameKey}`
        database.item[key] = GetFileURL(fileBaseDir)
    }
}

function Walk(dir = __dir) {
    return new Promise(async (resolve) => {
        for (let item of await fs.readdirSync(dir)) {
            item = path.join(dir, item)
            if (item.startsWith(path.join(__dir, 'male')) || item.startsWith(path.join(__dir, 'female'))) {
                if (fs.statSync(item).isDirectory()) await Walk(item)
                else await ProccessOnFile(item)
            }
        }
        resolve()
    })
}


function WriteDatabase() {
    fs.writeFileSync(path.join(__dir, OutDatabaseFileName), JSON.stringify(database))
}

SetBaseURL()
    .then(() => Walk())
    .then(() => WriteDatabase())