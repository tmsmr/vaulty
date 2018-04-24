const Actions = {
  themeToggle: (store) => {
    store.darkTheme = !store.darkTheme;
    store.notify();
  },
  open: (store, component) => {
    store.component = component;
    store.notify();
  },
  login: (store, username, password) => {
    return API.login(store.config.endpoint, username, password).then(auth => {
      store.auth = auth;
      console.log("routing to home screen")
    }).catch(err => {
      store.error = err.toString();
      store.notify();
    });
  }
};

const API = {
  login: (endpoint, username, password) => {
    return fetch(endpoint + "/v1/auth/userpass/login/" + username, {
      body: JSON.stringify({ password: password }),
      method: "POST"
    }).catch(err => {
      return Promise.reject("unable to reach vault");
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject("invalid login");
    }).then(body => {
      return body.auth;
    });
  }
};

export default Actions;
