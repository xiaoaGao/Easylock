import Toast from '@vant/weapp/toast/toast';

//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    username: '',
    passwd: '',
    status: 0,

  },

  onLoad(options) {
    this.setData({
      username: '',
      password: '',
      status: 0
    });
  },

  onChange(event) { //选择登陆身份
    this.setData({
      status: event.detail,
    });
  },
  login() {
    //登陆
    var sta = this.data.status;
    var that = this;
    if (that.data.username == '' || that.data.passwd == '') {
      Toast('用户名密码不能为空！');
    } else {
      if (sta == 1) { //房客
        wx.request({
          url: backurl + '/customer/login',
          method: 'POST',
          data: {
            username: that.data.username,
            passwd: that.data.passwd,
          },
          success(res) {
            console.log(res);
            if (res.data.code == 1) {
              wx.setStorageSync('status', 1);
              wx.setStorageSync('me', res.data.data);
              wx.redirectTo({
                url: '../cust_home/cust_home',
              })
            } else {
              Toast(res.data.msg);
            }
          }
        })
      } else if (sta == 2) { //房东
        wx.request({
          url: backurl + '/owner/login',
          method: 'POST',
          data: {
            username: that.data.username,
            passwd: that.data.passwd,
          },
          success(res) {
            console.log(res);
            if (res.data.code == 1) {
              wx.setStorageSync('status', 2);
              wx.setStorageSync('me', res.data.data);
              wx.switchTab({
                url: '../own_home/own_home',
              })
            } else {
              Toast(res.data.msg);
            }
          }
        })
      }
      else{
        Toast("请选择登陆身份！");
      }
    }
  },
  toRegister() {
    wx.navigateTo({
      url: '../register/register',
    })
  }

})