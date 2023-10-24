import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_URL

console.log("apiURL", apiUrl)

function getNationalBridges(uriString: string) {
  const url = `${apiUrl}/national?${uriString}`;
  console.log("url", url)
  return axios
    .get(url)
    .then((response: any) => response.data)
    .catch((error: Error) => console.error(`Error: ${error}`));
}

function getStateBridges(uriString: string) {
  const url = `${apiUrl}/state?${uriString}`;
  return axios
    .get(url)
    .then((response: any) => response.data)
    .catch((error: Error) => console.error(`Error: ${error}`));
}

function getConditionBridges(uriString: string) {
  const url=`${apiUrl}/conditions?${uriString}`;
  return axios
    .get(url)
    .then((response: any) => response.data)
    .catch((error: Error) => console.error(`Error: ${error}`));
}

export { getNationalBridges, getStateBridges, getConditionBridges };
