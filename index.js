const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {auth} = require('./middleware/auth')
const {User} = require('./models/User')
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
.then(() => console.log("mongodb connect"))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! :)')
})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
    user.save().then(()=> {
        res.status(200).json({success:true})
    }).catch((err) => {
        return res.json({success:false, err})
    })
})

app.post('/api/users/login', (req, res) => {
  //req로 넘어온 이메일이 데이터베이스에 있는지 확인
  User.findOne({email: req.body.email})
  .then(user => {
    if(!user) {
      return res.json({
        loginSuccess: false, 
        message: "no match"
      })
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch) return res.json({loginSuccess: false, message: "wrong password"})

      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)
      
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })    
  })
  .catch((err) => {
    return res.status(400).send(err)
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

