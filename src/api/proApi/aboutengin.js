import request from '../../utils/request';

// 上传
// 模型文件表保存接口
export function initProjectModelTree(data) {
  return request({
    url: 'api/bjbusiness/modelTree/initProjectModelTree',
    method: 'post',
    data
  });
}

// 目录树与文件创建关联接口
export function createContact(data) {
  return request({
    url: 'api/bjbusiness/modelTree/createContact',
    method: 'post',
    data
  });
}

// 目录树与文件解除关联接口
export function delContact(data) {
  return request({
    url: 'api/bjbusiness/modelTree/delContact',
    method: 'post',
    data
  });
}

// 模型目录树保存接口
export function savetreeItem(data) {
  return request({
    url: 'api/bjbusiness/modelTree/save',
    method: 'post',
    data
  });
}

// 模型目录树保存接口
export function updatetreeItem(data) {
  return request({
    url: 'api/bjbusiness/modelTree/update',
    method: 'post',
    data
  });
}

// 根据目录上级id查找模型目录树子集或者所关联的文件
export function findByIdInfo(params) {
  return request({
    url: 'api/bjbusiness/modelTree/findById/' + params,
    method: 'get'
  });
}

// 根据目录上级id删除模型目录树接口如果此目录树下方有目录树循环删除接口
export function delByIdInfo(params) {
  return request({
    url: 'api/bjbusiness/modelTree/delById/' + params,
    method: 'get'
  });
}

export function getAllTree(params) {
  return request({
    url: 'api/bjbusiness/modelTree/getAllTree/' + params,
    method: 'get'
  });
}

// 资源模块
export function modelFilelist(data) {
  return request({
    url: 'api/bjbusiness/modelFile/list',
    method: 'post',
    data
  });
}

// 提交转换接口
export function convertProject(id) {
  return request({
    url: 'api/bjbusiness/modelFile/convertProject/' + id,
    method: 'get'
  });
}
// 上传模型
export function uploadSave(data) {
  return request({
    url: 'api/bjbusiness/modelFile/save',
    method: 'post',
    data
  });
}

// 删除文件
export function delByIdFile(id) {
  return request({
    url: 'api/bjbusiness/modelFile/delById/' + id,
    method: 'get'
  });
}

// 引擎上传合并资源
export function MergeFiles(data) {
  return request({
    url: 'enginupload/Upload/MergeFiles',
    method: 'post',
    data
  });
}
// 引擎上传
export function FileUpload(data) {
  return request({
    url: 'enginupload/Upload/FileUpload',
    method: 'post',
    data
  });
}

// 分页条件查询文件接口
export function uploadLists(data) {
  return request({
    url: 'api/bjbusiness/modelFile/list',
    method: 'post',
    data
  });
}
