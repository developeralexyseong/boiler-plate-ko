const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    maxlength: 100
  },
  role: {
    type: Number,
    defalt: 0
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
})

// Arrow functions explicitly prevent binding this, so your method will not have access to the document and the above examples will not work.
// arrow fucntion쓰면 this 를 바인딩할 수 없으니 그냥 함수를 사용하라고 합니다.
userSchema.pre('save', function(next) {
  let user = this;

  // user모델안의 password가 변경되었을때만 bcrypt를 이용해서 암호화해준다.
  if(user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    // 암호화시키기위해서 bcrypt 사용
    bcrypt.genSalt(saltRounds, function(err, salt) {
      // next() 하면 index.js의 user.save()로 이동.
      if(err) return next(err);

      // user.password가 plain password
      // hash가 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function (err, hash) {
        if(err) return next(err);
        // 암호화된비밀번호를 만드는데 성공했다면 password를 hash로 대체해줍니다.
        user.password = hash;
        // 완성이 되었으면 index.js의 user.save()로 돌아가줍니다.
        next()
      })
    })
  } else {
    // 비밀번호를 변경하는 경우가 아니라면 바로 next()를 수행해서 index.js의 user.save()로 이동시킵니다.
    next()
  }
});

// cb는 callback function
userSchema.methods.comparePassword = function(plainPassword, cb) {
  // plain password 1234567  암호화된비밀번호 (암호화된 비밀번호를 복호화할 수 없기때문에 plain password를 암호화해서 비교)
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    // 에러는 없고, isMatch는 true일 것.
    cb(null, isMatch);
  })

};

userSchema.methods.generateToken = function(cb) {
  let user = this;

  // jwtwebtoken을 이용해서 토큰을 생성하기
  let token = jwt.sign(user._id.toHexString(), 'secretToken');
  // user._id + 'secretToken' = token
  // ->
  // 'secretToken' -> user._id

  user.token = token;
  user.save(function(err, user) {
    // cb는 콜백함수.
    if (err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb) {
  let user = this;

  // user._id + '' = token;
  // 토큰을 decode한다.
  //  error 또는 decoded는 decode된 user id
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저 아이디를 이용해서 user를 찾은 다음에
    // 클라이언트에서 가져온 token과 데이터베이스에 보관된토큰이 일치하는지 확인.

    // mongodb에 이미 있는 메서드
    user.findOne({ "_id": decoded , "token": token }, function(err, user) {
      // error 가 있다면 callback으로 err 전달.
      if(err) return cb(err);
      // 만약 error가 없다면 user정보를 전달.
      cb(null, user);
    })

  });


}


const User = mongoose.model('User', userSchema);

// 다른곳에서도 사용가능하도록 export 
module.exports = { User };