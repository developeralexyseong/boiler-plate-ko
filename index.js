const express = require('express');
const app = express();
const port = 5000;

// mongodb+srv://mitku:<password>@boilerplate.2kxww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mitku:1234@boilerplate.2kxww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));