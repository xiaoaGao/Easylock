// pages/record/record.js
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    rid:'',
    records:[],
    whoop:['你','时间段钥匙','密码钥匙']
  },

  
  onLoad(options) {
    var that = this;
    that.setData({
      rid: options.rid
    })
    wx.request({
      url: backurl + '/unlockrecord/getrecords/'+that.data.rid,
      method: 'GET',
      success(res) {
        console.log(res.data.data)
        if (res.data.code == 1) {
          var rs=[]
          for (var i = 0; i < res.data.data.length; i++) {
            console.log(res.data.data[i])
            rs.push(res.data.data[i])
          }
          that.setData({
            records:rs
          })
          console.log(that.data.records)
        }
    }})
  },

})