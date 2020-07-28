import Cookies from 'js-cookie';
const Users = 'user';
const inFifteenMinutes = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);

export function getToken(name) {
  return Cookies.get(name);
}

export function getUser() {
  return Cookies.get(Users);
}

export function setToken(name, token, timestamp) {
  return Cookies.set(name, token, { expires: timestamp });
}

export function setUser(datas) {
  return Cookies.set(Users, datas, { expires: inFifteenMinutes });
}

export function removeToken(name) {
  return Cookies.remove(name);
}

export function removeUser() {
  return Cookies.set(Users);
}
