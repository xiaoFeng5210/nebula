import request from '@/utils/request';

const baseUrl = 'api';

/**
 * 查询接口
 * @param data
 */
export const getDatumListClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/query',
    method: 'post',
    data
  });
};

/**
 * 新建文件接口
 * @param data
 */
export const createNewFileClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/save',
    method: 'post',
    data
  });
};

/**
 * 收藏/取消接口
 * @param data
 */
export const collectFile = data => {
  return request({
    url: baseUrl + '/bjpan/fileFavorite/favorite',
    method: 'post',
    data
  });
};

/**
 * 资料收藏：收藏列表接口
 * @param data
 */
export const collectList = data => {
  return request({
    url: baseUrl + '/bjpan/fileFavorite/list',
    method: 'post',
    data
  });
};

/**
 * 资料收藏：标签筛选
 * @param data
 */
export const tagFilter = data => {
  return request({
    url: baseUrl + '/bjpan/fileFavorite/listByTagIds',
    method: 'post',
    data
  });
};

/**
 * 资料收藏：按文件名模糊搜索
 * @param data
 */
export const fileSearch = data => {
  return request({
    url: baseUrl + '/bjpan/fileFavorite/query',
    method: 'post',
    data
  });
};

/**
 * 资料收藏：查找每一层文件夹
 * @param data
 */
export const searchChildren = data => {
  return request({
    url: baseUrl + '/bjpan/file/query',
    method: 'post',
    data
  });
};

/**
 * 资料收藏：批量取消收藏
 * @param data
 */
export const batchCancel = data => {
  return request({
    url: baseUrl + '/bjpan/fileFavorite/unfavoriteBatch',
    method: 'post',
    data
  });
};

/**
 * 资料：下载
 * @param data
 */
export const downFile = data => {
  return request({
    url: baseUrl + '/bjfiles/files/downloadFileAndOnline',
    method: 'post',
    data
  });
};

/**
 * 批量删除接口
 * @param data
 */
export const deleteFilesClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/delByIds',
    method: 'post',
    data
  });
};

/**
 * 重命名接口
 * @param data
 */
export const renameFileClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/rename',
    method: 'post',
    data
  });
};

/**
 * 获取标签列表接口
 * @param data
 */
export const getAllTagsClient = data => {
  return request({
    url: baseUrl + '/bjpan/tag/list',
    method: 'post',
    data
  });
};


/**
 * 获取标签所有颜色接口
 * @param data
 */
export const getAllTagsColorClient = data => {
  return request({
    url: baseUrl + '/bjpan/tag/listTagColors',
    method: 'post',
    data
  });
};

/**
 * 新增标签接口
 * @param data
 */
export const addNewTagClient = data => {
  return request({
    url: baseUrl + '/bjpan/tag/save',
    method: 'post',
    data
  });
};

/**
 * 更新标签接口
 * @param data
 */
export const editTagClient = data => {
  return request({
    url: baseUrl + '/bjpan/tag/update',
    method: 'post',
    data
  });
};

/**
 * 标签删除接口
 * @param data
 */
export const deleteTagClient = data => {
  return request({
    url: baseUrl + '/bjpan/tag/delById',
    method: 'post',
    data
  });
};

/**
 * 绑定标签接口
 * @param data
 */
export const bindTagClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/bingTags',
    method: 'post',
    data
  });
};

/**
 * 标签筛选搜索接口
 * @param data
 */
export const labelScreeningClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/listByTagIds',
    method: 'post',
    data
  });
};

/**
 * 列表删除接口
 * @param data
 */
export const deleteListClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/delByIds',
    method: 'post',
    data
  });
};

/**
 * 回收站查询接口
 * @param data
 */
export const getRecycleListClient = data => {
  return request({
    url: baseUrl + '/bjpan/fileDelete/query',
    method: 'post',
    data
  });
};

/**
 * 根据项目id，parentId查找每一层文件夹
 * @param data
 */
export const copyMoveQueryClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/queryFolder',
    method: 'post',
    data
  });
};

/**
 *
 * 回收站彻底删除接口
 * @param data
 */
export const deleteRecycleFilesClient = data => {
  return request({
    url: baseUrl + '/bjpan/fileDelete/delByIds',
    method: 'post',
    data
  });
};

/**
 * 文件移动接口
 * @param data
 */
export const moveToClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/move',
    method: 'post',
    data
  });
};

/**
 *
 * 回收站还原接口
 * @param data
 */
export const recoverRecycleFilesClient = data => {
  return request({
    url: baseUrl + '/bjpan/fileDelete/recoverByIds',
    method: 'post',
    data
  });
};

/**
 * 文件复制接口
 * @param data
 */
export const copyToClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/copy',
    method: 'post',
    data
  });
};

/**
 * 获取构件ID接口
 * @param data
 */
export const getStructureDirectoryClient = data => {
  return request({
    url: baseUrl + '/bjbusiness/scene/getTree',
    method: 'post',
    data
  });
};

/**
 * 资料文件id查询绑定构件ids接口
 * @param data
 */
export const findAllBuildIdsClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/findComponentsById',
    method: 'post',
    data
  });
};

/**
 * 资料文件批量绑定构件接口
 * @param data
 */
export const getAllBuildIdsClient = data => {
  return request({
    url: baseUrl + '/bjpan/file/bingComponents',
    method: 'post',
    data
  });
};

/**
 * 文件下载或在线接口
 * @param data
 */
export const downloadAndOnlineClient = data => {
  return request({
    url: baseUrl + '/bjfiles/files/downloadFileAndOnline',
    method: 'post',
    // responseType: 'blob',
    data
  });
};
