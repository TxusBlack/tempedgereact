import Axios from 'axios';
import FormData from 'form-data'

let baseUrlTempEdge = `http://10.1.10.101:8080`;
let baseUrlFaceRecognition = `http://10.1.10.101:9191`;

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
  post: async (url, data) => {
    console.log("JSON.stringify(data): ", JSON.stringify(data));
    let response = await Axios.post( baseUrlTempEdge + url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'auth': {
          username: 'my-trusted-clientt',
          password: 'secret'
        }
      },
      body: data
    });

    return response;
  },
  postImages: async (url, data) => {
    console.log("data: ", data);

    let imgJSONData = {
      file: data,
      empId: 5,
      role: ["ADMIN"]
    }

    let response = await Axios.post( (baseUrlFaceRecognition + url), imgJSONData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': `application/json`,
      },
      params: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTM5MTUyNzQsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiJlMDU3YWVkNS1mMGVjLTQzOGQtYTVlZC04ODEwOWViYjc5YWIiLCJjbGllbnRfaWQiOiJMdWlzLWNsaWVudCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSIsInRydXN0Il19.LkLEx7acIYLOGRmPbixW0B35VE3tlX_pkKalk3B5_OY"
      }
    });

    return response;
  }
}

export default HttpService;
