export const rememberMe = (key, value) => {
    if (typeof key !== 'string') return;
    localStorage.setItem(key, JSON.stringify(value));
}

export const getRememberMeData = (key) => {
    if (typeof key !== 'string') return;
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
        return JSON.parse(storedValue);
    }
    return null;
}

export const removeFromLocalStorage = (key) => {
    if (typeof key !== 'string') return;
    return localStorage.removeItem(key);
}