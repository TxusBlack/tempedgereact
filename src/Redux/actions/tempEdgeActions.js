import { LOGIN } from './types';
import Axios from 'axios';
import ls from 'local-storage'
import httpService from '../../utils/services/httpService/httpService';

let baseUrlTempEdge = `http://96.56.31.162:9191`;

export let doLogin = (url, data) => {
  return (dispatch) => {   //'dispatch', courtesy of the Thunk middleware so we can call it directly
    httpService.getAuthToken('/oauth/token', data)
      .then(async(res) => {
        let token = res.data.access_token;
        let ipAddress = window.location.hostname;
        console.log("token: ", token);
        console.log("ipAddress: ", ipAddress);

        ls.set('access_token', token);
        tempedgeAPI(url, data, LOGIN);
      });
  }
}

export let tempedgeAPI = (url, data, actionName) =>{
  return (dispatch) => {
    let token = ls.get('access_token');
    data.IPAddress = window.location.hostname;
    Axios({
      url: baseUrlTempEdge + url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
      params: {
        access_token: token
      }
    }).then((response) => {
      console.log("response: ", response);
      dispatch({
        type: actionName,
        payload: response.data.results
      });
    });
  }
}
