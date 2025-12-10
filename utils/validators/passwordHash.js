const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.hashPassword=async (password)=>{
   return bcrypt.hash(password, saltRounds).then(function(hash) {
        return hash
    });
}
exports.comparePassword=async(password,hash)=>{
    return bcrypt.compare(password, hash).then(function(result) {
        return result
    });
}