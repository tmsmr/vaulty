const Store = () => {
  return {
    component: "Login",
    subscribers: [],
    subscribe: function(s) {
      this.subscribers.push(s);
    },
    notify: function() {
      for (let i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i](this);
      }
    }
  };
};

export default Store;
