import { API } from 'aws-amplify';

export function generateChat(config) {
  // calls POST /generate
  return API.post('GenerateAPI', '/generate', { body: config });
}
