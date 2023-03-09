import Axios from "axios";

// export const sendRequest = async (requestConfig) => {
//   const response = await fetch(requestConfig.url, {
//     method: requestConfig.method ? requestConfig.method : "GET",
//     headers: requestConfig.headers ? requestConfig.headers : {},
//     body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
//   });

//   return response;
// };

export const sendRequest = async (requestConfig) => {
  const response = await Axios({
    url: requestConfig.url ? requestConfig.url : "",
    method: requestConfig.method ? requestConfig.method : "GET",
    headers: requestConfig.headers ? requestConfig.headers : {},
    data: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
  });

  return response;
};
