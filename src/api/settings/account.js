import request from '@/utils/request'
import qs from 'qs'
const AccountApi = {
  getAll: '/aclservice/user',
  create: '/aclservice/user',
  update: '/aclservice/user',
  delete: '/aclservice/user'
}

export function getAllService(data) {
  return request({
    url: `${AccountApi.getAll}?${qs.stringify(data)}`,
    method: 'GET',
  })
}

export function createService(data) {
  return request({
    url: AccountApi.create,
    method: 'POST',
    data
  })
}

export function updateService(data) {
  return request({
    url: AccountApi.update,
    method: 'PUT',
    data
  })
}

export function deleteService(data) {
  return request({
    url: `${AccountApi.delete}/${data.id}`,
    method: 'DELETE',
  })
}