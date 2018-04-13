const Actions = {
  themeToggle: (store) => {
    store.darkTheme = !store.darkTheme;
    store.notify();
  },
  open: (store, component) => {
    store.component = component;
    store.notify();
  }
};

export default Actions;
