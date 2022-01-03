// User모델가져옴.
const { User } = require('../models/User');


let auth = (req, res, next) => {
  // 인증처리를 하는 곳.
  // client cookies에서 token을 가져옴.
  // 저번에 cookie를 x_auth라는 이름으로 넣었었습니다.
  let token = req.cookies.x_auth;
  // let token = req.cookies['x_auth'];

  // token을 복호화한다음 user를 (user._id를 통해서 )찾습니다.
  // User모델에 findByToken() 생성
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    // error 가 없으면 isAuth false error true를 client에 전해줍니다.
    if(!user) return res.json({ isAuth: false, error: true });

    // user가 있으면 request token에 token 넣어주고 request user에 user정보를 넣어줍니다.
    // request에 token과 user를 넣어주는이유는 index.js에서 req를 받을때, 여기서 넣은것을 token과 user를 받을 수 있습니다. req.user, req.token이런식으로
    req.token = token;
    req.user = user;
    // next하는 이유는 middleware에서 할꺼했으면 다음으로 넘어갈 수 있도록 하는 것. next()없으면 middleware에 갇힘.
    next();
  });
  // 유저있으면 인증 ok, 유저없으면 인증 no.
};

module.exports = { auth };