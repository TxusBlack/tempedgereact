import Axios from 'axios';
let baseUrl = "https://jsonplaceholder.typicode.com";

let HttpService = {
  get: async (url, term) => {
    let response = await Axios.get(baseUrl + url, {
      params: {
        query: term
      },
      headers:{

      }
    });

    return response;
  },
  post: async (url, data) => {
    let response = await Axios.post(baseUrl + url, {
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return response;
  }
}

export default HttpService;
