import Axios from 'axios';
import FormData from 'form-data'

let baseUrlTempEdge = `http://96.56.31.162:9191`;
let baseUrlFaceRecognition = `http://96.56.31.162:9191`;

let HttpService = {
  get: async (url) => {
    console.log("url: ", baseUrlFaceRecognition + url);
    let response = await Axios.get(baseUrlFaceRecognition + url, {
      params: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTM4NTk3MTUsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI4N2NiMWM1ZS0xMWE1LTQ4YzItYTM1Ni02NmY1MDEyNTRiNjEiLCJjbGllbnRfaWQiOiJMdWlzLWNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSIsInRydXN0Il19.tiymxbf-o0_48aqw8dO1RBFA2co91bXTqbAx-eUDf1c"
      }
    });

    return response;
  },
  post: async (url, data) => {      //FUNCIONA !!!!!!!
    var bodyFormData = new FormData();
    bodyFormData.set('username', data.username);
    bodyFormData.set('password', data.password);
    bodyFormData.set('grant_type', data.grant_type);

    let response = await Axios.post( (baseUrlTempEdge + url), bodyFormData, {
      headers: {
        'Authorization': "Basic " + btoa("Luis-client"+":"+"Luis-password")
      },
    });

    return response;
  },
  postImages: async (url, data) => {
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    let newArray = await data.map( (img, index) => {
      let newStr = img.replace("data:image/jpeg;base64,", "");
      let file = dataURLtoFile(`data:image/jpeg;base64,${newStr}`, `user-${index}.jpeg`);

      return file;
    });

    var bodyFormData = new FormData();
    bodyFormData.set('file', newArray);
    bodyFormData.set('empId', "5");
    bodyFormData.set('role', "ADMIN");

    console.log("newArray: ", newArray);
    console.log("bodyFormData: ", bodyFormData);

    let response = await Axios.post( (baseUrlFaceRecognition + url), bodyFormData, {
      headers: {
        'Authorization': "Basic " + btoa("Luis-client"+":"+"Luis-password")
      },
      params: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTQwMzczODgsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiIwMGY5MTJlNy1kODZiLTQ3OGYtOWU2YS1kNGQ0MDBiNzJmOTEiLCJjbGllbnRfaWQiOiJMdWlzLWNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSIsInRydXN0Il19.C3HjzGz0I0qfC_IPg7BSdFdkTua2TYdYhLWFU3nEzCc"
      }
    });

    return response;
  },

// postImage: async (url, data) => {
//   console.log("data: ", data);
//   let imgArray = [];
//   imgArray.push(data)
//   var bodyFormData = new FormData();
//   bodyFormData.set('file', imgArray);
//   bodyFormData.set('empId', "5");
//   bodyFormData.set('role', "ADMIN");
//
//     let imgFileName = `snapshot-${1}.jpg`;
//
//     let obj = "ABCDEFG"; //data.replace("data:image/jpeg;base64,", "");
//
//
//   let imgJSONData = {
//     file: obj,
//     empId: 5,
//     role: ["ADMIN"]
//   }
//
//   console.log("bodyFormData: ", bodyFormData);
//
//   let response = await Axios.post( (baseUrlFaceRecognition + url), bodyFormData, {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': `multipart/form-data`,
//     },
//     params: {
//       access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTM5MjA4OTksInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI1NTA1NTE4Mi02OWM5LTQ1ZGMtYTNkMC04YTQxZjc2NGZjMzgiLCJjbGllbnRfaWQiOiJMdWlzLWNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSIsInRydXN0Il19.Dkr0fSQB_V7iPdqwfUBuTsHAbj9uYU265ziuVoz08Vo"
//     }
//   });
//
//   return response;
// }
}

export default HttpService;
