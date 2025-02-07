//global variables
const appState = {
  vaultAddress: "",
};

export const setAppState = (key: keyof typeof appState, value: string) => {
  appState[key] = value;
};

export const getAppState = (key: keyof typeof appState) => appState[key];

export default appState;






