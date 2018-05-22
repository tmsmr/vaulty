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
    return API.login(store.config.endpoint, username, password).then(auth => {
      store.auth = auth;
      store.notify();
      Actions.open(store, "Secrets");
    }).catch(err => {
      Actions.err(store, err);
      store.notify();
    });
  },
  fetchSecretKeys: (store, path) => {
    return API.list(store.config.endpoint, store.auth.client_token, path).then(list => {
      const folders = list.filter(key => key.endsWith("/"))
        .map(item => ({item, folder: true}))
        .sort();
      const secrets = list.filter(key => !key.endsWith("/"))
        .map(item => ({item, folder: false, value: null}))
        .sort();
      store.secrets = folders.concat(secrets);
      let pathelems = [""];
      pathelems.push(...path.split("/").filter(elem => elem.length > 0));
      store.path = pathelems.map(elem => elem + "/");
      store.notify();
    });
  },
  fetchSecretValues: (store, path) => {
    return Promise.all(store.secrets.filter(elem => !elem.folder).map(secret => {
      return API.get(store.config.endpoint, store.auth.client_token, path + secret.item).then(secretValue => {
        secret.value = secretValue;
      })
    })).then(() => store.notify());
  },
  loadSecrets: (store, path) => {
    return Actions.fetchSecretKeys(store, path).then(() => {
      return Actions.fetchSecretValues(store, path);
    }).catch(err => {
      Actions.err(store, err);
    });
  },
  deleteSecret: (store, path, secret) => {
    return API.del(store.config.endpoint, store.auth.client_token, path).then(() => {
      store.secrets.splice(store.secrets.indexOf(secret), 1);
      store.notify();
      if (store.secrets.length === 0) {
        Actions.loadSecrets(store, "/");
      }
    }).catch(err => {
      Actions.err(store, err);
    });
  }
};

const API = {
  fetch: (url, options, error) => {
    return fetch(url, options, error).catch(() => {
      return Promise.reject("Unable to reach Vault endpoint " + url);
    }).then(response => {
      if (!response.ok) {
        return Promise.reject(error);
      }
      return response;
    });
  },
  fetchJSON: (url, options, error) => {
    return API.fetch(url, options, error).then(response => {
      return response.json();
    });
  },
  login: (endpoint, username, password) => {
    return API.fetchJSON(endpoint + "/v1/auth/userpass/login/" + username, {
      body: JSON.stringify({password: password}),
      method: "POST"
    }, "Invalid Vault login").then(body => {
      return body.auth;
    });
  },
  list: (endpoint, token, path) => {
    return API.fetchJSON(endpoint + "/v1/secret/metadata" + path, {
      headers: {
        "X-Vault-Token": token
      },
      method: "LIST"
    }, "Unable to retrieve list for " + path).then(body => {
      return body.data.keys;
    });
  },
  get: (endpoint, token, path) => {
    return API.fetchJSON(endpoint + "/v1/secret/data" + path, {
      headers: {
        "X-Vault-Token": token
      },
      method: "GET"
    }, "Unable to retrieve secret " + path).then(body => {
      return body.data.data.value;
    });
  },
  set: (endpoint, token, path, value) => {
    return API.fetch(endpoint + "/v1/secret/data" + path, {
      headers: {
        "X-Vault-Token": token
      },
      body: JSON.stringify({data: {value: value}}),
      method: "POST"
    }, "Unable to set secret " + path);
  },
  del: (endpoint, token, path) => {
    return API.fetch(endpoint + "/v1/secret/metadata" + path, {
      headers: {
        "X-Vault-Token": token
      },
      method: "DELETE"
    }, "Unable to delete secret " + path);
  }
};

export default Actions;
