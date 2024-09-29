import { RequestHeaders, RequestBody } from "@/types";

function addAuthToken(headers: RequestHeaders | undefined) {
  headers = {
    "Content-Type": "application/json",
    ...headers,
  };
  const jwt: string | null = localStorage.getItem("jwt");
  if (jwt) headers["Authorization"] = jwt;
  return headers;
}

async function get(url: string, headers?: RequestHeaders) {
  headers = addAuthToken(headers);
  const res = await fetch(url, {
    mode: "cors",
    method: "GET",
    headers: headers as HeadersInit,
  });
  const data = await res.json();
  return data;
}

async function post(
  url: string,
  body: RequestBody = {},
  headers?: RequestHeaders,
) {
  headers = addAuthToken(headers);
  const res = await fetch(url, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify(body),
    headers: headers as HeadersInit,
  });
  const data = await res.json();
  return data;
}

async function put(
  url: string,
  body: RequestBody = {},
  headers?: RequestHeaders,
) {
  headers = addAuthToken(headers);
  const res = await fetch(url, {
    mode: "cors",
    method: "PUT",
    body: JSON.stringify(body),
    headers: headers as HeadersInit,
  });
  const data = await res.json();
  return data;
}

async function _delete(
  url: string,
  body: RequestBody = {},
  headers?: RequestHeaders,
) {
  headers = addAuthToken(headers);
  const res = await fetch(url, {
    mode: "cors",
    method: "DELETE",
    body: JSON.stringify(body),
    headers: headers as HeadersInit,
  });
  const data = await res.json();
  return data;
}

const request = {
  get,
  post,
  put,
  delete: _delete,
};

export default request;
