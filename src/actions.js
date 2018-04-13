const Actions = {
  open: (store, component) => {
    store.component = component;
    store.notify();
  }
};

export default Actions;
