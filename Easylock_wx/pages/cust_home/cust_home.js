const app = getApp();
const backurl = app.globalData.backurl;
Page({

  data: {
    keys:[]
  },

  // 每个tabbar页面要加
  onShow: function () {
    console.log('mine')
    this.getTabBar().init(0);
  }
})