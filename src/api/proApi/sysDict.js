import request from '../../utils/request';
export function sysDictList(data) {
  return request({
    url: 'api/bjbasicdata/sysDict/list',
    method: 'post',
    data
  });
}

export function sysDictsave(data) {
  return request({
    url: 'api/bjbasicdata/sysDict/save',
    method: 'post',
    data
  });
}

export function sysDictupdate(data) {
  return request({
    url: 'api/bjbasicdata/sysDict/update',
    method: 'post',
    data
  });
}

export function sysDictDelete(id) {
  return request({
    url: 'api/bjbasicdata/sysDict/delById/'+id,
    method: 'get'
  });
}
