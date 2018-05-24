const Actions = {
  themeToggle: (store) => {
    store.darkTheme = !store.darkTheme;
    localStorage.setItem('darkTheme', JSON.stringify({darkTheme: store.darkTheme}));
    store.notify();
  },
  loadPreferences: (store) => {
    let theme = JSON.parse(localStorage.getItem('darkTheme'));
    if (theme) {
      store.darkTheme = theme.darkTheme;
      store.notify();
    }
    let authMethod = JSON.parse(localStorage.getItem('authMethod'));
    if (authMethod) {
      store.authMethod = authMethod.method;
      store.notify();
    }
    let vaultEndpoint = JSON.parse(localStorage.getItem('endpoint'));
    if (vaultEndpoint) {
      store.endpoint = vaultEndpoint.vault;
      store.notify();
    }
  },
  setAuthMethod: (store, authMethod) => {
    store.authMethod = authMethod;
    localStorage.setItem('authMethod', JSON.stringify({method: store.authMethod}));
    store.notify();
  },
  setVaultEndpoint: (store, vaultEndpoint) => {
    store.endpoint = vaultEndpoint;
    localStorage.setItem('endpoint', JSON.stringify({vault: store.endpoint}));
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
  autologin: (store) => {
    let auth = JSON.parse(localStorage.getItem('auth'));
    if (auth) {
      store.auth = auth;
      store.notify();
      Actions.open(store, 'Secrets');
    }
  },
  loginUserPass: (store, username, password) => {
    return API.login(store.endpoint, username, password, 'userpass').then(auth => {
      store.auth = auth;
      localStorage.setItem('auth', JSON.stringify(auth));
      store.notify();
      Actions.open(store, 'Secrets');
    }).catch(err => {
      Actions.err(store, err.error);
    });
  },
  loginLDAP: (store, username, password) => {
    return API.login(store.endpoint, username, password, 'ldap').then(auth => {
      store.auth = auth;
      localStorage.setItem('auth', JSON.stringify(auth));
      store.notify();
      Actions.open(store, 'Secrets');
    }).catch(err => {
      Actions.err(store, err.error);
    });
  },
  logout: (store) => {
    localStorage.removeItem('auth');
    store.auth = null;
    Actions.open(store, "Login");
  },
  fetchSecretKeys: (store, path) => {
    return API.list(store.endpoint, store.auth.client_token, path).then(list => {
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
      return API.get(store.endpoint, store.auth.client_token, path + secret.item).then(secretValue => {
        secret.value = secretValue;
      })
    })).then(() => store.notify());
  },
  loadSecrets: (store, path) => {
    return Actions.fetchSecretKeys(store, path).then(() => {
      return Actions.fetchSecretValues(store, path);
    }).catch(err => {
      Actions.err(store, err.error);
      if (err.status === 403) Actions.logout(store);

    });
  },
  deleteSecret: (store, path, secret) => {
    return API.del(store.endpoint, store.auth.client_token, path).then(() => {
      store.secrets.splice(store.secrets.indexOf(secret), 1);
      store.notify();
      if (store.secrets.length === 0) {
        Actions.loadSecrets(store, "/");
      }
    }).catch(err => {
      if (err.status === 403) Actions.err(store, err.error + " (Forbidden)");
      else Actions.err(store, err.error);
    });
  },
  updateSecret: (store, path, secret, newValue) => {
    return API.set(store.endpoint, store.auth.client_token, path, newValue).then(() => {
      secret.value = newValue;
      store.notify();
    }).catch(err => {
      if (err.status === 403) Actions.err(store, err.error + " (Forbidden)");
      else Actions.err(store, err.error);
      return Promise.reject(err.error);
    });
  },
  addSecret: (store, path, value) => {
    return API.get(store.endpoint, store.auth.client_token, path).then(() => {
      Actions.err(store, "Secret " + path + " exists already");
    }).catch(notfound => {
      if (notfound.status && notfound.status === 404) {
        return API.set(store.endpoint, store.auth.client_token, path, value).then(() => {
          Actions.loadSecrets(store, path.substr(0, path.lastIndexOf("/") + 1));
        }).catch(err => {
          if (err.status === 403) Actions.err(store, err.error + " (Forbidden)");
          else Actions.err(store, err.error);
        });
      } else {
        Actions.err(store, notfound.error);
      }
    });
  }
};

const API = {
  fetch: (url, options, error) => {
    return fetch(url, options, error).catch(() => {
      return Promise.reject({error: "Unable to reach " + url, status: null});
    }).then(response => {
      if (!response.ok) {
        return Promise.reject({error: error, status: response.status});
      }
      return response;
    });
  },
  fetchJSON: (url, options, error) => {
    return API.fetch(url, options, error).then(response => {
      return response.json();
    });
  },
  login: (endpoint, username, password, method) => {
    return API.fetchJSON(endpoint + "/v1/auth/" + method + "/login/" + username, {
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
