import request from '../../utils/request';
export function getAllByProjectId(id) {
  return request({
    url: 'api/bjbasicdata/sysJob/getAllByProjectId/'+id,
    method: 'get'
  });
}

export function getAllByProjectlist(data) {
  return request({
    url: 'api/bjbasicdata/sysJob/list',
    method: 'post',
    data
  });
}

export function sysJobSave(data) {
  return request({
    url: 'api/bjbasicdata/sysJob/save',
    method: 'post',
    data
  });
}

export function sysJobUpdate(data) {
  return request({
    url: 'api/bjbasicdata/sysJob/update',
    method: 'post',
    data
  });
}

export function sysJobDelById(id) {
  return request({
    url: 'api/bjbasicdata/sysJob/delById/'+id,
    method: 'get'
  });
}

