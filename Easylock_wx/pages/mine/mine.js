Page({

  data: {
    realname:'',
    username:'',
    gender:'',
    phone:'',
    imgsrc:'../../statics/icons/man.png',
    status:0,
  },


  //每个tabbar页面要加
  onShow: function () {
    console.log('mine')
    this.getTabBar().init(1);
  },
  onReady:function(){
    var that=this;
    var me=wx.getStorageSync('me')
    that.setData({
      username:me.username,
      realname:me.realname,
      gender:me.gender,
      phone:me.phone
    })
    if(that.data.gender=='女'){
      that.setData({
        imgsrc:'../../statics/icons/female.png'
      })
    }
  },
  unload:function(){
    //退出登陆
    wx.clearStorage({
      success: (res) => {
        console.log("数据清除成功");
      },
    })
    wx.redirectTo({
      url: '../index/index',
    })
  }

})