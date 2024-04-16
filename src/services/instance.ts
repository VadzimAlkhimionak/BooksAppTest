import ky from 'ky';

const prefixUrl = 'http://localhost:3000/';

export const instance = ky.extend({
  prefixUrl,
  headers: {
    Accept: 'application/json',
  },
});
