const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // 스페이스를 없애주는 역할
        unique: 1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type: String, 
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    imgage: String,
    token: {
        type: String
    },
    tokenExp:{
        type: Number
    }
})

userSchema.pre('save', function(next){
    var user = this

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return nect(err)
    
                user.password = hash
                next()
            })
        })
    } else{
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save().then(() => {
        cb(null, user)
    }).catch((err) => {
        return cb(err)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    jwt.verify(token, 'secretToken', function(err, decoded) {
        user.findOne({"_id": decoded, "token": token})
        .then(user => {
            cb(null, user)
        }).catch((err) => {
            return cb(err)
          })
    })
}

const User = mongoose.model("User", userSchema)

module.exports = {User}