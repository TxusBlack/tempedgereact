import { FETCH_POSTS, NEW_POST, SET_POSTS } from '../actions/types';

let initialState = {
  items: [],
  item: {}
}

export default function(state = initialState, action){
  switch(action.type){
    case FETCH_POSTS:
      //'...state' below, creates an object, populates it first with the values in 'state': {>> items: [] <<, item: {}},
      return{   //then 'items' below overwrites the previously assigned empty array with the payload (action.payload)
        ...state,   //current state
        items: action.payload   //all posts
      };
    case NEW_POST:
      return{
        ...state,
        item: action.payload   //new post
      }
    case SET_POSTS:
      return{
        ...state,   //current state
        items: action.payload   //all posts, including newly created post
      }
    default:
      return state;
  }
}
