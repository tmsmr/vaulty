const Actions = {
  themeToggle: (store) => {
    store.darkTheme = !store.darkTheme;
    store.notify();
  },
  open: (store, component) => {
    store.component = component;
    store.notify();
  },
  errReset: (store) => {
    store.error = null;
    store.notify();
  },
  login: (store, username, password) => {
    API.login(store.config.endpoint, username, password).then(auth => {
      store.auth = auth;
      Actions.open(store, "Secrets");
    }).catch(err => {
      store.error = err.toString();
      store.notify();
    });
  },
  loadSecrets: (store, path) => {
    API.list(store.config.endpoint, store.auth.client_token, path).then(list => {
      list = list.keys;
      list.sort();
      let secrets = [];
      for (let i in list) {
        if (list[i].endsWith("/")) {
          secrets.push({
            item: list[i],
            type: "folder"
          });
        } else {
          secrets.push({
            item: list[i],
            type: "secret",
            secret: null
          });
        }
      }
      store.secrets = secrets;
      store.notify();
    }).then(() => {
      for (let i in store.secrets) {
        if (store.secrets[i].type === "secret") {
          API.get(store.config.endpoint, store.auth.client_token, path + store.secrets[i].item).then(secret => {
            store.secrets[i].secret = secret.data.value;
            store.notify();
          }).catch(err => {
            store.error = err.toString();
            store.notify();
          });
        }
      }
    }).catch(err => {
      store.error = err.toString();
      store.notify();
    });
  }
};

const API = {
  login: (endpoint, username, password) => {
    return fetch(endpoint + "/v1/auth/userpass/login/" + username, {
      body: JSON.stringify({password: password}),
      method: "POST"
    }).catch(() => {
      return Promise.reject("Unable to reach Vault endpoint");
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject("Invalid Vault login");
    }).then(body => {
      return body.auth;
    });
  },
  list: (endpoint, token, path) => {
    return fetch(endpoint + "/v1/secret/metadata" + path, {
      headers: {
        "X-Vault-Token": token
      },
      method: "LIST"
    }).catch(() => {
      return Promise.reject("Unable to reach Vault endpoint " + endpoint);
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject("Unable to retrieve list for " + path);
    }).then(body => {
      return body.data;
    });
  },
  get: (endpoint, token, path) => {
    return fetch(endpoint + "/v1/secret/data" + path, {
      headers: {
        "X-Vault-Token": token
      },
      method: "GET"
    }).catch(() => {
      return Promise.reject("Unable to reach Vault endpoint " + endpoint);
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject("Unable to retrieve secret " + path);
    }).then(body => {
      return body.data;
    });
  }
};

export default Actions;
