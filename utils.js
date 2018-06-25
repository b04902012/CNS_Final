const crypto=require('crypto')
const db=require('./database')
const hash=require('./crypto').hash
const encrypt=require('./crypto').encrypt
const decrypt=require('./crypto').decrypt
const randomNumber=require('random-number-csprng')

async function getRandomString(digits,all=false){
    let charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let s=''
    for(let i=0;i<digits;i++){
        randidx=await randomNumber(0,charset.length)
        s+=charset.charAt(randidx);
    }
    return s;
}

exports.getValidShortURL=async()=>{
    let shortURL=await getRandomString(7)
    let result=await exports.find(shortURL)
    while(result){
        console.log('result: '+result)
        shortURL=getRandomString(7)
        result=await exports.find(shortURL)
    }
    return shortURL
}

exports.insert=(shortURL,longURL,iv)=>{
    iv=crypto.randomBytes(16)
    longURL=encrypt(longURL,hash(shortURL,50,iv),iv)
    return db.insert(hash(shortURL,100),longURL,iv)
}

exports.find=async(shortURL)=>{
    let result=await db.find(hash(shortURL,100))
    if(!result)return undefined
    longURL=result.longURL
    iv=Buffer.from(result.iv,'hex')
    longURL=decrypt(longURL,hash(shortURL,50,iv),iv)
    return longURL
}
