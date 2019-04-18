import { SET_ACTIVE_PAGE, LOGIN } from '../actions/types';

let initialState = {
  active_page: '',
  login: ''
}

export default function(state = initialState, action){
  switch(action.type){
    case SET_ACTIVE_PAGE:
      return{
        ...state,
        active_page: action.payload
      };
    case LOGIN:
      return{
        ...state,
        login: action.payload
      };
    default:
      return state;
  }
}
