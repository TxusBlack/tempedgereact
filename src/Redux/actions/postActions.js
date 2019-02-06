import { FETCH_POSTS, NEW_POST, SET_POSTS } from './types';

export let fetchPosts = () => {
  return (dispatch) => {   //'dispatch', courtesy of the Thunk middleware so we can call it directly
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        return res.json();
      }).then((data) => {
        dispatch({        //This object is the 'action' obj returned to the reducer
          type: FETCH_POSTS,
          payload: data
        });
      });
  }
}

export let createPost = (postData) => {
  return (dispatch) => {   //'dispatch', courtesy of the Thunk middleware so we can call it directly
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(postData)
    }).then((res) => {
      return res.json();
    }).then((data) => {
      dispatch({          //This object is the 'action' obj returned to the reducer
        type: NEW_POST,
        payload: data
      });
    });
  }
}

export let setPosts = (posts) => {
  return (dispatch) => {
    dispatch({          //This object is the 'action' obj returned to the reducer
      type: SET_POSTS,
      payload: posts
    });
  }
}
