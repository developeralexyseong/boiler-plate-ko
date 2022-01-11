import { combineReducers } from "redux";
import user from './user_reducer';
// import user from './user_reducer';
// import comment from './comment_reducer';

const rootReducer = combineReducers({
  user,
  // comment
})

// 다른파일에서도 reducer를 쓸 수 있도록 export
export default rootReducer;