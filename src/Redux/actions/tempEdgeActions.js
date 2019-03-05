import { SET_ACTIVE_PAGE } from './types';

export let setActivePage = (activePage) => {
  return (dispatch) => {   //'dispatch', courtesy of the Thunk middleware so we can call it directly
    dispatch({
      type: SET_ACTIVE_PAGE,
      payload: activePage
    });
  }
}
