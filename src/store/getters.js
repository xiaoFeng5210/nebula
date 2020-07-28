const getters = {
  projectName: state => state.projectName.projectName,
  id: state => state.projectName.id,
  token: state => state.user.token,
  isload: state => state.prolist.isload,
  searchobj: state => state.prolist.searchobj
};
export default getters;
