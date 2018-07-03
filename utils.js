const crypto=require('crypto')
const db=require('./database')
const hash=require('./crypto').hash
const encrypt=require('./crypto').encrypt
const decrypt=require('./crypto').decrypt
const randomNumber=require('random-number-csprng')
const N = require('./config').N
const L = require('./config').L

async function getRandomString(digits){
    let charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let s=''
    for(let i=0;i<digits;i++){
        randidx=await randomNumber(0,charset.length-1)
        console.log(randidx)
        s+=charset.charAt(randidx);
    }
    return s;
}

exports.getValidShortURL=async()=>{
    let shortURL=await getRandomString(L)
    let result=await exports.find(shortURL)
    while(result){
        console.log('result: '+result)
        shortURL=await getRandomString(L)
        result=await exports.find(shortURL)
    }
    return shortURL
}

exports.insert=(shortURL,longURL,iv)=>{
    iv=crypto.randomBytes(16)
    longURL=encrypt(longURL,hash(shortURL,1,iv),iv)
    return db.insert(hash(shortURL,2*N),longURL,iv)
}

exports.find=async(shortURL)=>{
    let result=await db.find(hash(shortURL,2*N))
    if(!result)return undefined
    longURL=result.longURL
    iv=Buffer.from(result.iv,'hex')
    longURL=decrypt(longURL,hash(shortURL,1,iv),iv)
    return longURL
}
