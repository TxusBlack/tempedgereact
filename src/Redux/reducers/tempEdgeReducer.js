import { SET_ACTIVE_PAGE } from '../actions/types';

let initialState = {
  active_page: ''
}

export default function(state = initialState, action){
  switch(action.type){
    case SET_ACTIVE_PAGE:
      return{
        ...state,
        active_page: action.payload
      };
    default:
      return state;
  }
}
