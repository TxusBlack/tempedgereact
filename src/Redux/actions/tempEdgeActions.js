
import { LOGIN, SAVE_FORM_POSITION, SAVE_FILTER_LIST, SAVE_DEPARTMENTS_LIST, SAVE_POSITIONS_LIST, REMOVE_FROM_POSITIONS_LIST, REMOVE_FROM_DEPARTMENTS_LIST, SKILLS_LIST, VALIDATE_PERSON, PERSON_SAVE, CLEAR_PROP, CLEAR_ERROR_FIELD, SET_ERROR_FIELD, REMOVE_ERROR_FIELD } from './types';

import history from '../../history.js';
import Axios from 'axios';
//import ls from 'local-storage'
import httpService from '../../utils/services/httpService/httpService';

let baseUrlTempEdge = `http://10.1.10.52:9191`;
//let baseUrlTempEdge = `http://localhost:9191`;

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
        }).then(async (response) => {
          sessionStorage.setItem('leftNavMenu', JSON.stringify(response.data.result.portalUserList[0].user.roles[0].menu));

          dispatch({
            type: LOGIN,
            payload: response.data.result
          });

          let lang = window.location.pathname;
          lang = lang.split("/");
          let agencyList = response.data.result.portalUserList;

          if(agencyList.length < 1){
            history.push(`/error/${lang[2]}`);
          }else if(agencyList.length === 1){
            sessionStorage.setItem('agency', JSON.stringify(response.data.result.portalUserList[0]));

            if(response.data.result.portalUserList[0].status === "A" && response.data.result.portalUserList[0].organizationEntity.status === "A"){
              history.push(`/dashboard/${lang[2]}`);
            }else if(response.data.result.portalUserList[0].status === "P"  && response.data.result.portalUserList[0].organizationEntity.status === "A" /*&& response.data.result.portalUserList[0].userRoleId >= 4*/){
              history.push(`/pending/user/${lang[2]}`);
            }else if(response.data.result.portalUserList[0].status === "P"  && response.data.result.portalUserList[0].organizationEntity.status === "P"){
              history.push(`/pending/agency/${lang[2]}`);
            }else if(response.data.result.portalUserList[0].status === "D"  && response.data.result.portalUserList[0].organizationEntity.status === "A"){
              history.push(`/denied/user/${lang[2]}`);
              //history.push(`/register/${lang[2]}`);
            }else if(response.data.result.portalUserList[0].status === "D"  && response.data.result.portalUserList[0].organizationEntity.status === "D"){
              history.push(`/denied/agency/${lang[2]}`);
              //history.push(`/registerAgency/${lang[2]}`);
            }else if(response.data.result.portalUserList[0].status === "ERROR"){
              history.push(`/error/${lang[2]}`);
            }else{
              history.push(`/auth/${lang[2]}`);
            }
          }else if(agencyList.length > 1){
            history.push(`/dashboard/${lang[2]}`);
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
      dispatch({
        type: actionName,
        payload: (actionName !== VALIDATE_PERSON && actionName !== PERSON_SAVE)? response.data.result: response
      });
    });
  }
}

export let tempedgeMultiPartApi = (url, data, fileArray, actionName) => {
  return (dispatch) => {
    let token = sessionStorage.getItem('access_token');
    let formData = new FormData();
    let jsonse = JSON.stringify(data);
    let blob = new Blob([jsonse], {type: "application/json"});

    formData.append('personEntity', blob);
    formData.append('document', fileArray.documents);
    formData.append('resume', fileArray.resume);
    data.base64Dco = data.base64Resume = null;

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url: baseUrlTempEdge + url,
      method: 'post',
      data: formData,
      params: {
        access_token: token
      }
    };

    Axios(options)
      .then(response => {
        dispatch({
          type: actionName,
          payload: (actionName !== VALIDATE_PERSON && actionName !== PERSON_SAVE)? response.data.result: response
        });
      });
  }
}

export let clearTempedgeStoreProp = (actionProp) => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PROP,
      payload: actionProp
    })
  }
}

export let clearErrorField = (actionProp) => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ERROR_FIELD,
      payload: {
        errorFields: [],
        lastRemoved: ''
      }
    })
  }
}

export let getListSafe = (url, data, actionName) => {
  return (dispatch) => {
    let token = sessionStorage.getItem('access_token');

    let options = {
      headers: { 'Content-Type': 'application/json' },
      params: { access_token: token }
    };

    Axios.post((baseUrlTempEdge + url), data ,options)
      .then((response) => {
        dispatch({
          type: actionName,
          payload: response.data.result
        });
      });
  }
}

export let getList = (url, actionName) => {
  return (dispatch) => {
    httpService.get(url)
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

export let getFilters = (url, data, actionName) => {
  return (dispatch) => {
    httpService.get(url)
      .then((response) => {
        dispatch({
          type: actionName,
          payload: response.data.result
        });
      });
    }
}

export let saveDepartmentList = (newDept) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_DEPARTMENTS_LIST,
      payload: newDept
    })
  }
}

export let savePositionsList = (newPos) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_POSITIONS_LIST,
      payload: newPos
    });
  }
}

export let removeFromPositionList = (index) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_FROM_POSITIONS_LIST,
      payload: index
    });
  }
}

export let removeFromDepartmentList = (index) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_FROM_DEPARTMENTS_LIST,
      payload: index
    });
  }
}


export let setErrorField = (fieldName) => {
  return (dispatch) => {
    dispatch({
      type: SET_ERROR_FIELD,
      payload: fieldName
    });
  }
}

export let removeErrorField = (fieldName) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_ERROR_FIELD,
      payload: fieldName
    });
  }
}
