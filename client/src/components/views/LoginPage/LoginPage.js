import { Axios } from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';

function LoginPage(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let navigate = useNavigate();

  // event.target.value도 됩니다.
  // event.target.value는 자식요소를 반환.
  // event.currentTarget.value는 부모요소도도 반환.
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onPasswordHanlder = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    // 해주는 이유는 새로고침방지. (form 제출 누르면 refresh 되어버리면, 원래해야될 일들을 제대로 적어놓지못하고 페이지가리프레쉬되어버림)
    // 이를 막기 위해서 event.preventDefault()를 수행.
    event.preventDefault();

    // console.log(`Email ${email}`);
    // console.log(`Password ${password}`);

    let body = {
      email: email,
      password: password
    }

    // useDispatch()를 사용한 dispatch로 loginUser action 수행.
    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess) {
          navigate('/')
        } else {
          alert('Error')
        }
      })


  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <form 
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={password} onChange={onPasswordHanlder} />
        <br/>
        <button>
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
