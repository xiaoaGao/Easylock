const app = getApp();
const backurl = app.globalData.backurl;
Page({

  data: {
    keys: []

  },

  onLoad() {
    var that = this
    that.flash()
  },
  flash() {
    //刷新页面
    var that = this
    var me = wx.getStorageSync('me')
    wx.request({
      url: backurl + '/customer/getmyroom',
      method: 'GET',
      data: {
        phone: me.phone
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            keys: res.data.data
          })
        } else {

        }
      }
    })
  },
  tocsroom(e) {
      wx.navigateTo({
        //带参数跳转到其他页面
        url: '../csroom/csroom?oid='+e.currentTarget.dataset.oid+"&roomnum="+e.currentTarget.dataset.roomnum+"&deviceid="+e.currentTarget.dataset.deviceid+"&ordid="+e.currentTarget.dataset.ordid+"&standard="+e.currentTarget.dataset.standard+"&jieshao="+e.currentTarget.dataset.jieshao+"&location="+e.currentTarget.dataset.location+"&rid="+e.currentTarget.dataset.rid+"&ready="+e.currentTarget.dataset.ready
      })
  },
  // 每个tabbar页面要加
  onShow: function () {
    console.log('mine')
    this.getTabBar().init(0);
  }
})