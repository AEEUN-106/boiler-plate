const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:asd1245!@cluster0.6hxpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("mongodb connect"))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

