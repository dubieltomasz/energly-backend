import fetch from 'node-fetch';

const api_url : URL = new URL(process.env.API_URL ?? '');

const headers = {
  'Accept':'application/json'
};

export const energyMix = async () => {
  const response = await fetch(api_url, {method: 'GET', headers: headers})
  
  if(!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));

  return JSON.stringify(data, null, 2);
}