export const debug = (msg) => {
    const now = new Date().toLocaleTimeString();
    logWindow.innerHTML += `[${now}] ${msg}\n`;
    logWindow.scrollTop = logWindow.scrollHeight;
};