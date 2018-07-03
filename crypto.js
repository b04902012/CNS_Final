const crypto = require('crypto')
const pbkdf2 = crypto.pbkdf2Sync
const N = require('./config').N
hex2a=(hex)=>{
    var str=''
    for(i=0;i<64;i+=2)
        str+=String.fromCharCode(parseInt(hex.substr(i,2)))
    return str
}

hash=(s,n=1,salt='')=>{
    for(let i=0;i<n;i++){
        s=s+salt
        let sha256=crypto.createHash('sha256')
        sha256.update(s)
        s=sha256.digest('hex')
    }
    return s
}

encrypt=(data,key,iv)=>{
    key=pbkdf2(key,'',N,32,'sha256')
    console.log(key)
    console.log(iv)
    let cipher=crypto.createCipheriv('aes256', key, iv)
    let encrypted=cipher.update(data,'utf8','hex')
    encrypted+=cipher.final('hex')
    return encrypted
    /*return new Promise((res,rej)=>{
        key=pbkdf2.pbkdf2Sync(key,'',1,32,'sha256')
        console.log(key)
        console.log(iv)
        let cipher=crypto.createCipheriv('aes256', key, iv)
        let encrypted=cipher.update(data,'utf8','hex')
        encrypted+=cipher.final('hex')
        return encrypted
    }*/
}

decrypt=(data,key,iv)=>{
    key=pbkdf2(key,'',N,32,'sha256')
    console.log(data)
    console.log(key)
    console.log(iv)
    let decipher=crypto.createDecipheriv('aes256',key,iv)
    let decrypted=decipher.update(data,'hex','utf8')
    decrypted+=decipher.final('utf8')
    return decrypted
/*    return new Promise((res,rej)=>{
        key=pbkdf2.pbkdf2Sync(key,'',1,32,'sha256')
        console.log(data)
        console.log(key)
        console.log(iv)
        let decipher=crypto.createDecipheriv('aes256',key,iv)
        let decrypted = '';
        decipher.on('readable', () => {
            const data=decipher.read()
            if (data)
                decrypted += data.toString('utf8')
        })
        decipher.on('end', () => {
            console.log(decrypted)
            res(decrypted)
        })
        decipher.write(data,hex)
        decipher.end()
    }*/
}

module.exports={
    'hex2a':hex2a,
    'hash':hash,
    'encrypt':encrypt,
    'decrypt':decrypt,
}
