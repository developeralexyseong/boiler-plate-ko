const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

// bodyparser가 client에서 오는정보를 서버에서 분석해서 가져올 수 있도록함.

// application/x-www-form-urlencoded 분석해서 가져옴.
app.use(bodyParser.urlencoded({extended: true}));
// application/json 분석해서 가져옴.
app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('2022 happy new year! have alot of luck in this year!');
});

app.post('/register', (req, res) => {

  // 회원가입할때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어줍니다.
  const user = new User(req.body);
  // mongo db에서 오는 save() 
  // 정보들을 user model에 저장.
  user.save((err, doc) => {
    // 실패하면 json형태로 전달, err메시지도 함께 전달
    if(err) return res.json({ success: false, err})
    // status 200은 성공했다는 의미.
    return res.status(200).json({
      success: true
    })
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

