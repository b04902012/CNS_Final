const crypto=require('crypto')
const hash=require('./crypto').hash
const hex2a=require('./crypto').hex2a
const encrypt=require('./crypto').encrypt
const decrypt=require('./crypto').decrypt
const pbkdf2 = require('pbkdf2')
var iv=crypto.randomBytes(16)
var key=pbkdf2.pbkdf2Sync('key','',1,32,'sha256')
let cipher=crypto.createCipheriv('aes256', key, iv)
let decipher=crypto.createDecipheriv('aes256',key,iv)
let encrypted = '';
cipher.on('readable', () => {
  const data = cipher.read();
  if (data)
    encrypted += data.toString('hex');
});
cipher.on('end', () => {
  console.log(encrypted);
  decipher.write(encrypted,'hex')
  decipher.end()
  // Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
});
cipher.write('some cleasdagagar text data');
cipher.end()

let decrypted=''
decipher.on('readable', () => {
  const data = decipher.read();
  if (data)
    decrypted += data.toString('utf8');
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});
