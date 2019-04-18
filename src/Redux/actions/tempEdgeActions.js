import { SET_ACTIVE_PAGE, LOGIN } from './types';
import Axios from 'axios';
import httpService from '../../utils/services/httpService/httpService';

let baseUrlTempEdge = `http://96.56.31.162:9191`;

export let setActivePage = (activePage) => {
  return (dispatch) => {   //'dispatch', courtesy of the Thunk middleware so we can call it directly
    dispatch({
      type: SET_ACTIVE_PAGE,
      payload: activePage
    });
  }
}

export let doLogin = (url, data) => {
  return (dispatch) => {   //'dispatch', courtesy of the Thunk middleware so we can call it directly
    httpService.getAuthToken('/oauth/token', data)
      .then(async(res) => {
        let token = res.data.access_token;
        let ipAddress = window.location.hostname;
        console.log("token: ", token);
        console.log("ipAddress: ", ipAddress);

        Axios({
          url: baseUrlTempEdge + url,
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            "username" : data.username,
            "IPAddress": "http://10.1.1.1"
          },
          params: {
            access_token: token
          }
        }).then((response) => {
          console.log("response: ", response);
        });
      });
  }
}
