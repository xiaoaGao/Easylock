import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    realname: '',
    username: '',
    gender: '',
    phone: '',
    imgsrc: '../../statics/icons/man.png',
    status: 0,
    showchangepwd: false,
    oldpwd: '',
    newpwd: ''
  },


  //每个tabbar页面要加
  onShow: function () {
    console.log('mine')
    this.getTabBar().init(1);
  },
  onReady: function () {
    var that = this;
    var me = wx.getStorageSync('me')
    that.setData({
      username: me.username,
      realname: me.realname,
      gender: me.gender,
      phone: me.phone
    })
    if (that.data.gender == '女') {
      that.setData({
        imgsrc: '../../statics/icons/female.png'
      })
    }
  },
  unload: function () {
    //退出登陆
    Dialog.confirm({
      message: '确定退出登陆吗？',
    })
      .then(() => {
        wx.clearStorage({
          success: (res) => {
            console.log("数据清除成功");
          },
        })
        wx.redirectTo({
          url: '../index/index',
        })
      })
      .catch(() => {
        // on cancel
      });
    
  },
  changepwd() {
    var that = this
    that.setData({
      showchangepwd: true
    })

  },

  tochangepwd() {
    var that = this
    var newpwd = that.data.newpwd
    if (!that.validPassword(newpwd)) {
      Toast('新密码不符合要求！')
      return
    }
    var status = wx.getStorageSync('status') //1为房客，2为房东
    var me = wx.getStorageSync('me')
    if (status == 1) {
      //房客修改密码
      wx.request({
        url: backurl + '/customer/changepwd' + '?cid=' + me.cid + "&oldpwd=" + that.data.oldpwd + "&newpwd=" + that.data.newpwd,
        method: 'POST',
        success(res) {
          console.log(res.data);
          // Toast(res.data.msg);
          if (res.data.code == 1) {
            that.setData({
              showchangepwd: false
            })
            Toast(res.data.msg, );
          } else {
            Toast(res.data.msg);
          }
        }
      })
    } else {
      //房东修改密码
      wx.request({
        url: backurl + '/owner/changepwd' + '?oid=' + me.oid + "&oldpwd=" + that.data.oldpwd + "&newpwd=" + that.data.newpwd,
        method: 'POST',
        success(res) {
          console.log(res.data);
          // Toast(res.data.msg);
          if (res.data.code == 1) {
            that.setData({
              showchangepwd: false
            })
            Toast(res.data.msg, );
          } else {
            Toast(res.data.msg);
          }
        }
      })
    }
  },
  // 8-16位必须包含数字、字母
  validPassword(password) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^(?=.*[a-zA-Z])(?=.*\d).{8,16}/
    return reg.test(password)
  }
})