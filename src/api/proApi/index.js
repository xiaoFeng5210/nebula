import request from '../../utils/request';

// 获取所有项目集
export function projectAll(data) {
  return request({
    url: 'api/bjbasicdata/project/all',
    method: 'post',
    data
  });
}

export function getSingleListByCompanyId(data) {
  return request({
    url: 'api/bjbasicdata/project/getSingleListByCompanyId',
    method: 'post',
    data
  });
}

// 根据项目名称查找单项目
export function findByProjectName(data) {
  return request({
    url: 'api/bjbasicdata/project/findByProjectName',
    method: 'post',
    data
  });
}

// 保存项目
export function projectSave(data) {
  return request({
    url: 'api/bjbasicdata/project/save',
    method: 'post',
    data
  });
}

//修改项目
export function projectUpdate(data) {
  return request({
    url: 'api/bjbasicdata/project/update',
    method: 'post',
    data
  });
}

//删除项目
export function delById(data) {
  return request({
    url: 'api/bjbasicdata/project/delById',
    method: 'post',
    data
  });
}

// 图片上传
export function uploadImg(data) {
  return request({
    url: 'api/bjfiles/files/upload',
    method: 'post',
    data
  });
}
