const db=require('./database')
const hash=require('./hash').hash
exports.insert=(shortURL,longURL)=>{
    return db.insert(hash(shortURL),longURL)
}
exports.find=(shortURL)=>{
    let result=await db.find(hash(shortURL))
    return result
}
