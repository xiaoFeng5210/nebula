const prolist = {
  state: {
    isload: 0,
    searchobj: {}
  },

  mutations: {
    SET_LOAD: (state) => {
      state.isload = state.isload + 1;
    },
    SET_SEARCHOBJ: (state, searchobj) => {
      state.searchobj = searchobj;
    }
  }
};
export default prolist;
