import request from '../../utils/request';

// 获取所有项目集
export function sysInviteSave(data) {
  return request({
    url: 'api/bjbasicdata/sysInvite/save',
    method: 'post',
    data
  });
}//findById/{id}

export function findById(id) {
  return request({
    url: 'api/bjbasicdata/sysInvite/findById/'+id,
    method: 'get'
  });
}
