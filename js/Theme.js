import { STORAGE_KEYS } from './config.js';
                
export function applyTheme(t) {                                                                                                                                                                             
    document.documentElement.dataset.theme = t;
    localStorage.setItem(STORAGE_KEYS.theme, t);
}                                                                                                                                                                                                               

export function loadTheme() {                                                                                                                                                                                   
    return localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
}                                                           
                                                                                                                                                                                                                
export function toggleTheme() {
    const current = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';                                                                                                                        
    applyTheme(current);                                                                  
    return current;  
}  

