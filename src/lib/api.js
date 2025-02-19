import axiosInstance from "./axios"

const buildUrlWithParams = (baseUrl, params) => {
    // Create an array to store the query parameters
    const queryParams = [];
  
    // Loop through the object and create query string pairs
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      }
    }
  
    // Combine the base URL with the query string
    const queryString = queryParams.join('&');
    
    // Add a '?' if there are query parameters, otherwise return the base URL as is
    return baseUrl.includes('?') ? `${baseUrl}&${queryString}` : `${baseUrl}?${queryString}`;
  }

export const fetchApi = async (url, params) => {
    try {
        let response = await axiosInstance.get(buildUrlWithParams(url, params));
        return response.data;
    } catch(error) {
        return error.response.data;
    }
}

export const postApi = async (url, params, data) => {
    try {
        let response = await axiosInstance.post(buildUrlWithParams(url, params), data);
        return response.data;
    } catch(error) {
        return error.response.data;
    }
}