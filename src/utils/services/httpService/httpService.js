import Axios from 'axios';
import FormData from 'form-data'

let baseUrlTempEdge = `http://10.1.10.74:9191`;
//let baseUrlTempEdge = `http://localhost:9191`;     //***Must change this URL in the actions file as well***
let baseUrlFaceRecognition = `http://localhost:9191`;

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

let HttpService = {
  getList: async (url) => {
    let response = await Axios({
      url: baseUrlTempEdge + url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "IPAddress" : "10.1.1.1"
      }
    });

    return response;
  },
  postCreateNew: async (url, data) => {     //Create New User, Agency & others
    let response = await Axios({
      url: baseUrlTempEdge + url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    });

    return response;
  },
  getAuthToken: async(url, data) => {      //FR y TempEdge
    let bodyFormData = new FormData();
    bodyFormData.set('username', data.username);
    bodyFormData.set('password', data.password);
    bodyFormData.set('grant_type', data.grant_type);

    return Axios.post( (baseUrlTempEdge + url), bodyFormData, {
      headers: {
          'Authorization': "Basic " + btoa("Luis-client"+":"+"Luis-password")
      }
    });
  },
  postImages: async (url, data) => {
    var bodyFormData = new FormData();

    let newArray = await data.map( (img, index) => {   //'newArray' holds the promise returned by await, do not remove
      let file = dataURLtoFile(img, `user-${index}.jpeg`);
      bodyFormData.append('file', file);
    });

    bodyFormData.append('empId', "60");
    // bodyFormData.set('role', "ADMIN");

    let response = await Axios({
      method: 'post',
      url: baseUrlFaceRecognition + url,
      data: bodyFormData,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },
      params: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTgxNTQ0MDMsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiJiZTFjMmU2Ni02Njg4LTQwNjItOTI4YS01ZGEyYjY0OTEzOGYiLCJjbGllbnRfaWQiOiJMdWlzLWNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSIsInRydXN0Il19.0-AOY6f_K6DziyYackSsPz-G3tVGC8B5EAN363Uorv4"
      }
    });

    return response;
  }
}

export default HttpService;
