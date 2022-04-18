export function signInSuccess(state, {username,accessToken}) {
  state.loggedIn = true;
  state.username = username;
  state.accessToken = accessToken;
}

export function signInFailure(state) {
  state.loggedIn = false;
  state.username = null;
  state.accessToken = null;
}

export function signOut(state) {
  state.loggedIn = false;
  state.username = null;
  state.accessToken = null;
}
