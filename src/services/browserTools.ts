export const getLocalStorage = (name: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(name);
  }
};

export const setLocalStorage = (name: string, data: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(name, data);
  }
};

export const removeLocalStorage = (name: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(name);
  }
};
