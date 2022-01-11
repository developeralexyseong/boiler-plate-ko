import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import ReduxThunk from 'redux-thunk';
// index.js뒤에 안쳐도 자동으로 가져와줍니다.
import Reducer from './_reducers';

// antd 설정완료.
import 'antd/dist/antd.css';

// middleware와 함께 만들어주는 이유, promise와 function도 받을 수 있도록 하기위해서.
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)


ReactDOM.render(
  <BrowserRouter>
    {/* strict 모드는 개발 모드에서만 활성화되기 때문에, 프로덕션 빌드에는 영향을 끼치지 않습니다. */}
    <React.StrictMode>
      <Provider store={createStoreWithMiddleware(Reducer,
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
        )}>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
