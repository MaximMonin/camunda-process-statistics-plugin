import { API } from '../types';

export const headers = (api: API) => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': api.CSRFToken,
  };
};

export const get = async (api: API, path: string, params?: Record<string, string>) => {
  // XXX: Workaround a possible bug where engine api has been parsed wrong
  if (api.engine.match(/\/#\//)) {
    api.engine = api.engine.split('/#/')[0].replace(/.*\//g, '');
    api.engineApi = api.baseApi + '/engine/' + api.engine;
  }

  const query = new URLSearchParams(params || {}).toString();
  const res = query
    ? await fetch(`${api.engineApi}${path}?${query}`, {
        method: 'get',
        headers: headers(api),
      })
    : await fetch(`${api.engineApi}${path}`, {
        method: 'get',
        headers: headers(api),
      });
  if (res.status === 200 && (res.headers.get('Content-Type') || '').startsWith('application/json')) {
    return await res.json();
  } else {
    if ((res.headers.get('Content-Type') || '').startsWith('application/json')) {
      console.debug(res.status, path, await res.json());
    } else {
      console.debug(res.status, path, await res.text());
    }
    return [];
  }
};
export const post = async (api: API, path: string, params?: Record<string, string>, payload?: string) => {
  const query = new URLSearchParams(params || {}).toString();
//  console.log (`${api.engineApi}${path}?${query}`);
//  console.log (payload);
  const res = query
    ? await fetch(`${api.engineApi}${path}?${query}`, {
        method: 'post',
        headers: headers(api),
        body: payload,
      })
    : await fetch(`${api.engineApi}${path}`, {
        method: 'post',
        headers: headers(api),
        body: payload,
      });
  if ((res.headers.get('Content-Type') || '').startsWith('application/json')) {
    return await res.json();
  } else {
    return await res.text();
  }
};
