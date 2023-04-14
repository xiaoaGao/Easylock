Page({

  data: {

  },

  // onShow: function () {
  //   if (typeof this.getTabBar === 'function' && this.getTabBar()) {
  //     this.getTabBar().setData({
  //       selected:0
  //     })
  //   }
  // }
  // 每个tabbar页面要加
  onShow: function () {
    console.log('mine')
    this.getTabBar().init(0);
  }
})