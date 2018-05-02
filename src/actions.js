const Actions = {
  themeToggle: (store) => {
    store.darkTheme = !store.darkTheme;
    store.notify();
  },
  open: (store, component) => {
    store.component = component;
    store.notify();
  },
  err: (store, err) => {
    store.error = err.toString();
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
      Actions.err(store, err);
    });
  },
  listSecrets: (store, path) => {
    return API.list(store.config.endpoint, store.auth.client_token, path).then(list => {
      const folders = list
        .filter(key => key.endsWith("/"))
        .map(item => ({item, folder: true}))
        .sort();
      const secrets = list
        .filter(key => !key.endsWith("/"))
        .map(item => ({item, folder: false, value:null}))
        .sort();
      store.secrets = folders.concat(secrets);
      let pathelems = [""];
      pathelems.push(...path.split("/").filter(elem => elem.length > 0));
      store.path = pathelems.map(elem => elem + "/");
      store.notify();
    });
  },
  fetchSecretValues: (store, path) => {
    store.secrets.forEach(secret => {
      if(!secret.folder) {
        API.get(store.config.endpoint, store.auth.client_token, path + secret.item).then(secretValue => {
          secret.value = secretValue;
          store.notify();
        }).catch(err => {
          Actions.err(store, err);
        });
      }
    });
  },
  loadSecrets: (store, path) => {
    Actions.listSecrets(store, path).then(() => {
      Actions.fetchSecretValues(store, path);
    }).catch(err => {
      Actions.err(store, err);
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
      return body.data.keys;
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
      return body.data.data.value;
    });
  },
  set: (endpoint, token, path, value) => {
    return fetch(endpoint + "/v1/secret/data" + path, {
      headers: {
        "X-Vault-Token": token
      },
      body: JSON.stringify({data: {value: value}}),
      method: "POST"
    }).catch(() => {
      return Promise.reject("Unable to reach Vault endpoint " + endpoint);
    }).then(response => {
      if (!response.ok) {
        return Promise.reject("Unable to set secret " + path);
      }
    });
  },
  del: (endpoint, token, path) => {
    return fetch(endpoint + "/v1/secret/metadata" + path, {
      headers: {
        "X-Vault-Token": token
      },
      method: "DELETE"
    }).catch(() => {
      return Promise.reject("Unable to reach Vault endpoint " + endpoint);
    }).then(response => {
      if (!response.ok) {
        return Promise.reject("Unable to delete secret " + path);
      }
    });
  }
};

export default Actions;
