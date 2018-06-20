const db=require('./database')
const hash=require('./hash').hash
function getRandomString(digits){
    var s=''
    while(digits){
        s=s+Math.random().toString(36)[2]
        digits--
    }
    return s
}

exports.getValidShortURL=async()=>{
    let shortURL=getRandomString(6)
    let result=await exports.find(shortURL)
    while(result){
        console.log('result: '+result)
        shortURL=getRandomString(6)
        result=await exports.find(shortURL)
    }
    return shortURL
}


exports.insert=(shortURL,longURL)=>{
    return db.insert(hash(shortURL),longURL)
}
exports.find=async (shortURL)=>{
    let result=await db.find(hash(shortURL))
    return result
}
