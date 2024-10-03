export function setCache(key: string, value: object) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCache(key: string) {
  const string = localStorage.getItem(key);
  if (!string) return null;
  return JSON.parse(string);
}
