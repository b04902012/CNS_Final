const crypto = require('crypto')
const sha256=crypto.createHash('sha256')
function hash(s){
    sha256.update(s)
    return sha256.digest()
}
