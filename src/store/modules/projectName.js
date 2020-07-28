export default {
  state: {
    projectName: '',
    id:0
  },
  mutations: {
    changeName(state, newName) {
      state.projectName = newName;
    },
    changeId(state, newId) {
      state.id = newId;
    }
  }
};
