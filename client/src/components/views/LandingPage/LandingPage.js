import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {

  // 랜딩페이지에 들어오자마자 get request를 서버로 보냄. endingpoint는 /api/hello
  useEffect(() => {
    // endpoint를 서버로 보냄.
    axios.get('/api/hello')
    // 응답이오면 console창에서 보여줍니다.
    .then(response => console.log(response.data));
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      시작페이지
    </div>
  )
}

export default LandingPage
