import request from '@/utils/request'

// 车辆进场
export function carDriveIn(data) {
  return request({
    url: `/parking/carDriveIn`,
    method: 'post',
    data: data
  })
}

// 查询车辆进场历史记录
export function getCarNumRecordList(data) {
  return request({
    url: `/parking/getCarNumRecordList`,
    method: 'post',
    data: data
  })
}
// 轮查
export function getTask(data) {
  return request({
    url: `/parking/getPollResult`,
    method: 'post',
    data
  })
}
// 查询停缴费
export function getParkingFee(data) {
  return request({
    url: `/parking/getParkingFee`,
    method: 'post',
    data: data
  })
}


// 查询停缴费
export function getPay(data) {
  return request({
    url: `/pay`,
    method: 'get',
    data: data
  })
}


// 支付宝支付
export function callAliPay(data) {
  return request({
    url: `/parking/pay/2`,
    method: 'post',
    data: data
  })
}


// 微信支付
export function callWxPay(data) {
  return request({
    url: `/parking/pay/1`,
    method: 'post',
    data: data
  })
}