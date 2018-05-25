const Store = () => {
  return {
    endpoint: "http://127.0.0.1:8200",
    mount: "vaulty-default",
    darkTheme: false,
    authMethod: "userpass",
    component: "Login",
    subscribers: [],
    subscribe: function (s) {
      this.subscribers.push(s);
    },
    notify: function () {
      for (let i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i](this);
      }
    }
  };
};

export default Store;
