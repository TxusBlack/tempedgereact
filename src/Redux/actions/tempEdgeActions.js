import { LOGIN, SAVE_FORM_POSITION } from './types';
import history from '../../history.js';
import Axios from 'axios';
//import ls from 'local-storage'
import httpService from '../../utils/services/httpService/httpService';

let baseUrlTempEdge = `http://localhost:9191`;

export let doLogin = (url, data) => {
  return (dispatch) => {   //'dispatch', courtesy of the Thunk middleware so we can call it directly
    httpService.getAuthToken('/oauth/token', data)
      .then((res) => {
        let token = res.data.access_token;
        data.IPAddress = window.location.hostname;

        sessionStorage.setItem('access_token', token);
        Axios({
          url: baseUrlTempEdge + url,
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data,
          params: {
            access_token: token
          }
        }).then((response) => {
          dispatch({
            type: LOGIN,
            payload: response.data.result
          });

          let lang = window.location.pathname;
          lang = lang.split("/");

          console.log("response.data.result.portalUserList[0].status: ", response.data.result.portalUserList[0].status);
          if(response.data.result.portalUserList[0].status === "A" && response.data.result.portalUserList[0].organizationEntity.status === "A"){
            history.push(`/protected/${lang[2]}`);
          }else if(response.data.result.portalUserList[0].status === "P"  && response.data.result.portalUserList[0].organizationEntity.status === "A" && response.data.result.portalUserList[0].userRoleId >= 4){
            history.push(`/pending/user/${lang[2]}`);
          }else if(response.data.result.portalUserList[0].status === "P"  && response.data.result.portalUserList[0].organizationEntity.status === "P" && response.data.result.portalUserList[0].userRoleId >= 4){
            history.push(`/pending/agency/${lang[2]}`);
          }else if(response.data.result.portalUserList[0].status === "D"  && response.data.result.portalUserList[0].organizationEntity.status === "A" && response.data.result.portalUserList[0].userRoleId >= 4){
            history.push(`/denied/user/${lang[2]}`);
            //history.push(`/register/${lang[2]}`);
          }else if(response.data.result.portalUserList[0].status === "D"  && response.data.result.portalUserList[0].organizationEntity.status === "D" && response.data.result.portalUserList[0].userRoleId >= 4){
            history.push(`/denied/agency/${lang[2]}`);
            //history.push(`/registerAgency/${lang[2]}`);
          }else if(response.data.result.portalUserList[0].status === "ERROR"){
            history.push(`/error/${lang[2]}`);
          }else{
            history.push(`/auth/${lang[2]}`);
          }
        });
      }).catch((error) => {
        let lang = window.location.pathname;
        lang = lang.split("/");

        history.push(`/error/${lang[2]}`);
      });
  }
}

export let tempedgeAPI = (url, data, actionName) => {
  return (dispatch) => {
    let token = sessionStorage.getItem('access_token');
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
        payload: response.data.result
      });
    });
  }
}

export let getList = (url, actionName) => {
  return (dispatch) => {
    httpService.getList(url)
      .then((response) => {
        dispatch({
          type: actionName,
          payload: response.data.result
        });
      });
    }
}

export let storeFormPageNumber = (formName, position) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_FORM_POSITION,
      payload: {
        form: formName,
        pos: position
      }
    });
  }
}
