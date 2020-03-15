import types from './types';
import history from '../../history.js';
import Axios from 'axios';
import httpService from '../../utils/services/httpService/httpService';

let baseUrlTempEdge = `http://100.1.147.42:9191`;

export let doLogin = (url, data) => {
  return (dispatch) => {
    httpService
      .getAuthToken('/oauth/token', data)
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
            access_token: token,
            browser: 'WEB'
          }
        }).then(async (response) => {
          dispatch({
            type: types.LOGIN,
            payload: response.data.result
          });

          let lang = window.location.pathname;
          lang = lang.split('/');
          let agencyList = response.data.result.portalUserList;

          if (agencyList.length < 1) {
            history.push(`/error/${lang[2]}`);
          } else if (agencyList.length === 1) {
            let org = agencyList[0];

            validateOrg(org);
          } else if (agencyList.length > 1) {
            history.push(`/organization-select/${lang[2]}`);
          }
        });
      })
      .catch((error) => {
        let lang = window.location.pathname;
        lang = lang.split('/');

        history.push(`/error/${lang[2]}`);
      });
  };
};

export let doLogout = (lang) => {
  return (dispatch) => {
    dispatch({
      type: types.LOGOUT,
      payload: {}
    });

    history.push(`/auth/${lang}`);
  };
};

export let validateOrg = (org) => {
  let lang = window.location.pathname;
  lang = lang.split('/');
  let leftMenuNav = JSON.parse(JSON.stringify(org.user.roles[0].menu));

  sessionStorage.setItem('agency', JSON.stringify(org));
  sessionStorage.setItem('leftNavMenu', JSON.stringify(leftMenuNav));

  if (org.status === 'A' && org.organizationEntity.status === 'A') {
    history.push(`/dashboard/${lang[2]}`);
  } else if (org.status === 'P' && org.organizationEntity.status === 'A') {
    history.push(`/pending/user/${lang[2]}`);
  } else if (org.status === 'P' && org.organizationEntity.status === 'P') {
    history.push(`/pending/agency/${lang[2]}`);
  } else if (org.status === 'D' && org.organizationEntity.status === 'A') {
    history.push(`/denied/user/${lang[2]}`);
    //history.push(`/register/${lang[2]}`);
  } else if (org.status === 'D' && org.organizationEntity.status === 'D') {
    history.push(`/denied/agency/${lang[2]}`);
    //history.push(`/registerAgency/${lang[2]}`);
  } else if (org.status === 'ERROR') {
    history.push(`/error/${lang[2]}`);
  } else {
    history.push(`/auth/${lang[2]}`);
  }
};

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
    })
      .then((response) => {
        dispatch({
          type: actionName,
          payload: response
        });
      })
      .catch((err) => {
        dispatch({
          type: actionName,
          payload: err
        });
      });
  };
};

export let tempedgeMultiPartApi = (url, data, fileArray, actionName) => {
  return (dispatch) => {
    let token = sessionStorage.getItem('access_token');
    let formData = new FormData();
    let jsonse = JSON.stringify(data);
    let blob = new Blob([jsonse], { type: 'application/json' });

    formData.append('personEntity', blob);
    if (fileArray && fileArray.length > 0) {
      formData.append('personEntity', blob);
      formData.append('document', fileArray.documents);
      formData.append('resume', fileArray.resume);
      data.base64Dco = data.base64Resume = null;
    }

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
      .then((response) => {
        dispatch({
          type: actionName,
          payload: actionName !== types.VALIDATE_PERSON && actionName !== types.PERSON_SAVE && actionName !== types.CREATE_CLIENT ? response.data.result : response
        });
      })
      .catch((err) => {
        dispatch({
          type: actionName,
          payload: err
        });
      });
  };
};

export let clearTempedgeStoreProp = (actionProp) => {
  return (dispatch) => {
    dispatch({
      type: types.CLEAR_PROP,
      payload: actionProp
    });
  };
};

export let clearErrorField = (actionProp) => {
  return (dispatch) => {
    dispatch({
      type: types.CLEAR_ERROR_FIELD,
      payload: {
        errorFields: [],
        lastRemoved: ''
      }
    });
  };
};

export let getListSafe = (url, data, actionName) => {
  return (dispatch) => {
    let token = sessionStorage.getItem('access_token');

    let options = {
      headers: { 'Content-Type': 'application/json' },
      params: { access_token: token }
    };

    Axios.post(baseUrlTempEdge + url, data, options).then((response) => {
      dispatch({
        type: actionName,
        payload: response.data.result
      });
    });
  };
};

export let getList = (url, actionName) => {
  return (dispatch) => {
    httpService.get(url).then((response) => {
      dispatch({
        type: actionName,
        payload: response.data.result
      });
    });
  };
};

export let storeFormPageNumber = (formName, position) => {
  return (dispatch) => {
    dispatch({
      type: types.SAVE_FORM_POSITION,
      payload: {
        form: formName,
        pos: position
      }
    });
  };
};

export let getFilters = (url, data, actionName) => {
  return (dispatch) => {
    httpService.get(url).then((response) => {
      dispatch({
        type: actionName,
        payload: response.data.result
      });
    });
  };
};

export let saveDepartmentList = (deptList) => {
  return (dispatch) => {
    dispatch({
      type: types.SAVE_DEPARTMENTS_LIST,
      payload: deptList
    });
  };
};

export let savePositionsList = (positionsList) => {
  return (dispatch) => {
    dispatch({
      type: types.SAVE_POSITIONS_LIST,
      payload: positionsList
    });
  };
};

export let saveToPositionsList = (newPos) => {
  return (dispatch) => {
    dispatch({
      type: types.SAVE_TO_POSITIONS_LIST,
      payload: newPos
    });
  };
};

export let removeFromDepartmentList = (index) => {
  return (dispatch) => {
    dispatch({
      type: types.REMOVE_FROM_DEPARTMENTS_LIST,
      payload: index
    });
  };
};

export let setErrorField = (fieldName) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_ERROR_FIELD,
      payload: fieldName
    });
  };
};

export let removeErrorField = (fieldName) => {
  return (dispatch) => {
    dispatch({
      type: types.REMOVE_ERROR_FIELD,
      payload: fieldName
    });
  };
};

export let saveBillRates = (rate, type) => {
  return (dispatch) => {
    dispatch({
      type: type,
      payload: rate
    });
  };
};
