const crypto = require('crypto')
exports.hash=(s)=>{
    console.log(s)
    let sha256=crypto.createHash('sha256')
    sha256.update(s)
    return sha256.digest()
}
