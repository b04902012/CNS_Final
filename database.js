const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName='CNS'
const clName='shortenURL';
var clientPromise = MongoClient.connect(url)
exports.insert=async(shortURL,longURL)=>{
    let client=await clientPromise
    let db=client.db(dbName)
    let cl=db.collection(clName)
    let result=await cl.findOne({'shortURL':shortURL})
    if(result){
        throw('shortURL used')
    }
    try{
        await cl.insertOne({'shortURL':shortURL,'longURL':longURL})
    }
    catch(error){
        console.error(error)
        throw('Unknown error occurs')
    }
}
exports.find=async(shortURL)=>{
    let client=await clientPromise
    let db=client.db(dbName)
    let cl=db.collection(clName)
    return cl.findOne({'shortURL':shortURL})
}
