const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName='CNS'
const clName='shortenURL'
client = await MongoClient.connect(url)
const db=client.db(dbName)
const cl=db.collection(clName)
exports.insert=(shortURL,longURL)=>{
    let insert_promise=new Promise( (res,rej)=>{
        result=await cl.findOne({'shortURL':shortURL})
        if(result){
            rej('shortURL used')
        }
        try{
            await cl.insertOne({'shortURL':shortURL,'longURL':longURL})
        }
        catch(error){
            console.error(error)
            rej('Unknown error occurs')
        }
        res('Requested URL set')
    })
    return insert_promise
}
exports.find=(shortURL)=>{
    let find_promise=new Promise( (res,rej)=>{
        result=await cl.findOne({'shortURL':shortURL})
        res(result)
    }
    return find_promise
}
