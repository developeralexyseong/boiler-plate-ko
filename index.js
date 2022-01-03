const express = require('express');
// express app 생성, 포트 고정.
const app = express();
const port = 5000;
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');


// bodyparser는 client에서 오는정보를 서버에서 분석해서 가져올 수 있습니다.

// application/x-www-form-urlencoded 분석해서 가져옴.
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 분석해서 가져옴.
app.use(bodyParser.json());
// cookieParser를 사용할 수 있습니다.
app.use(cookieParser());

const mongoose = require('mongoose');
const { response } = require('express');

mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('2022 happy new year! have alot of luck in this year!');
});

app.post('/api/users/register', (req, res) => {
  //회원 가입 시 필요한 정보들을 client에서 가져온 뒤 DB에 넣어줌.
  //req.body:body-parser통해 json형식으로 정보 저장.
  const user = new User(req.body);
  // mongo db에서 오는 save() 
  // 정보들을 user model에 저장.
  user.save((err, userInfo) => {
    // 실패하면 json형태로 전달, err메시지도 함께 전달
    if(err) return res.json({ success: false, err})
    // status 200은 성공했다는 의미.
    return res.status(200).json({
      success: true
    })
  })
});



// 로그인 기능만들기
app.post('/api/users/login', (req, res) => {

  
  // 첫번째 할 일 : 요청된 이메일을 데이터베이스에서 있는지 찾습니다.
  // findOne()몽고디비에서 제공하는 함수
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 두번재 할 일 : 요청할 현재 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인합니다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      // 비밀번호가 틀렸을 경우.
      if(!isMatch)
        return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다. '});
    })

    // 마지막 할 일 : 비밀번호까지 맞다면 해당 user를 위한 token을 생성합니다.
    user.generateToken((err, user) => {
      // status 400은 error 가 있다는 것
      if (err) return res.status(400).send(err);

      // 토큰을 저장한다. 어디에 ? 쿠키 또는 로컬스토리지
      // 쿠키는 console창 application 탭에 cookies
      // LocalStorage 또는 Session Storage 에도 저장가능 (어디에 저장해야 안전한지는 논란이 많습니다. 각기 장단점 존재.)
      // user.toekn이 쿠키입니다. x_auth라는이름으로 웹 어플리케이션 Cookies에 저장해보도록 하겠습니다.
      //  status 200은 성공했다는 의미. (userid도 함께 보내줍니다. )
      res.cookie("x_auth", user.token) 
      .status(200)
      .json({ loginSuccess: true, userId: user._id });
    })
  })
})

// 인증과 관련된 부분은 복잡. login route와 마찬가지로 복잡한 부분임을 생각하고 반복숙달하도록 합니다.
// auth라는 middleware 사용 
// endpoint에서 request를 받은 이후에 callbackfunction을 받기 전에 중간에 무언가를 해주는 것을 middleware라고 합니다.
app.get('/api/users/auth', auth , (req, res) => {
  // authentication이 flase가 나오면 여기까지 못오고, 다른곳으로 리턴해서  빠져나가게 됩니다.
  // 여기까지 미들웨어를 통과해 왔다는 얘기는, Authentication이 True라는 것.
  // status200으로 json으로 정보전달.
  //  role 은 언제든지 설정을 통해서 변경이 가능 (지금상황은 role이 0이면 일반유저, role이 0이 아니면 관리자로 설정. )
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})


// logout route
// login된 상태이기 때문에 auth middleware를 넣을 수 있습니다.
app.get('/api/users/logout', auth, (req, res) => {
  // 미들웨어에서 가져와서 찾은다음 (req.user미들웨어에서 넣어주었었음,)
  // token을 빈문자열로만들어 업데이트해줍니다. findOneAndUpdate

  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    // 에러나면 success: false와 err를 json형태로 전달하고, 성공하면 200status와 함께 success: true를 보내줍니다.
    if(err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

