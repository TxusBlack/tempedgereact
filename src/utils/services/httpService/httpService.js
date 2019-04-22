import Axios from 'axios';
import FormData from 'form-data'

//let baseUrlTempEdge = `http://localhost:8080`;
let baseUrlTempEdge = `http://96.56.31.162:9191`;
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
    console.log("url: ", baseUrlTempEdge + url);

    let response = await Axios({
      url: baseUrlTempEdge + url,
      method: 'post',
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

    let newArray = await data.map( (img, index) => {
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
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTU2MzcwMjEsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI4NzkwZTgyYi1kZTUyLTQyM2ItYjg1OC03MWRjZGMyNDNiZjMiLCJjbGllbnRfaWQiOiJMdWlzLWNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSIsInRydXN0Il19.84RitXDEV4MhAlGpQVoqSmM6HvziYL-k2OZrbg5cyp8"
      }
    });

    return response;
  },
  postImage: async (url, data) => {
    let file = dataURLtoFile(data, `snapshot-${1}.jpg`);

    var bodyFormData = new FormData();
    bodyFormData.append("file",file);
    bodyFormData.append('empIds', ["60"]);

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
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTU2MzcwMjEsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI4NzkwZTgyYi1kZTUyLTQyM2ItYjg1OC03MWRjZGMyNDNiZjMiLCJjbGllbnRfaWQiOiJMdWlzLWNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSIsInRydXN0Il19.84RitXDEV4MhAlGpQVoqSmM6HvziYL-k2OZrbg5cyp8"
      }
    });

    return response;
  }
}

export default HttpService;
