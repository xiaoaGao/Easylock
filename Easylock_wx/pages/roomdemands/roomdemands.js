import Toast from '@vant/weapp/toast/toast';
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    rid: '',
    demands: [],
    done: ['未处理', '同意', '拒绝'],
    type: ['更换床单', '更换毛巾', '打扫房间', '维修电器']
  },
  onLoad(options) {
    var that = this
    that.setData({
      rid: options.rid
    })
    that.setData({
      demands: wx.getStorageSync(that.data.rid)
    })
  },
  onUnload(){
    wx.setStorageSync(that.data.rid, that.data.demands)
  },
  permissionprolong(e) {
    var that=this
    //同意续住
    wx.request({
      url: backurl + '/demand/dodemand',
      method: 'POST',
      data:{
        did:e.currentTarget.dataset.did
      },
      success(res) {
        // console.log(res)
        if(res.data.code==1){
          Toast(res.data.msg)
          var rs=[]
          that.data.demands.forEach((item, idx) => {
           if(item.did!==e.currentTarget.dataset.did){
             rs.push(item)
           }
          })
          that.setData({
            demands: rs
          })
        }
        else{
          Toast(res.data.msg)
        }
      }
    })
  },
  rejectprolong(e){
    var that=this
    //拒绝续住
    wx.request({
      url: backurl + '/demand/rejectprolong',
      method: 'POST',
      data:{
        did:e.currentTarget.dataset.did,
        dtype:1
      },
      success(res) {
        // console.log(res)
        if(res.data.code==1){
          Toast(res.data.msg)
          var rs=[]
          that.data.demands.forEach((item, idx) => {
           if(item.did!==e.currentTarget.dataset.did){
             rs.push(item)
           }
          })
          that.setData({
            demands: rs
          })
        }
        else{
          Toast(res.data.msg)
        }
      }
    })
  },
  dodemand(e){
    var that=this
    //处理其他请求
    wx.request({
      url: backurl + '/demand/dodemand',
      method: 'POST',
      data:{
        did:e.currentTarget.dataset.did,
      },
      success(res) {
        // console.log(res)
        if(res.data.code==1){
          Toast(res.data.msg)
          var rs=[]
          that.data.demands.forEach((item, idx) => {
           if(item.did!==e.currentTarget.dataset.did){
             rs.push(item)
           }
          })
          that.setData({
            demands: rs
          })
        }
        else{
          Toast(res.data.msg)
        }
      }
    })
  }
})