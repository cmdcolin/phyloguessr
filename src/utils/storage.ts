export function localStorageGetItem(key: string) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key)
  }
  return null
}

export function sessionStorageGetItem(key: string) {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key)
  }
  return null
}
