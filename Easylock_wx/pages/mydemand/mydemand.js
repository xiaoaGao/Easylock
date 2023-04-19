const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    ordid:'',
    demands:[],
    done:['未处理','同意','拒绝'],
    type:['更换床单','更换毛巾','打扫房间','维修电器']
  },
  onLoad(options) {
    var that=this
    that.setData({
      ordid:options.ordid
    })
    wx.request({
      url: backurl + '/demand/custgetdemand/'+that.data.ordid,
      method: 'GET',
      success(res) {
        console.log(res);
        that.setData({
          demands:res.data.data
        })
        console.log(that.data.demands)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})