import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    rid:'',
    active: 0,
    given1:[],
    given2:[]
  },

  onLoad(options) {
    var that = this;
    that.setData({
      rid: options.rid
    })
    this.flash()
  },
  flash(){
    var that=this
    that.setData({given1:[]})
    wx.request({
      url: backurl + '/orders/getgiven/'+that.data.rid,
      method: 'GET',
      success(res) {
        // console.log(res.data.data)
        if (res.data.code == 1) {
          var rs=[]
          for (var i = 0; i < res.data.data.length; i++) {
            console.log(res.data.data[i])
            rs.push(res.data.data[i])
          }
          that.setData({
            given1:rs
          })
        }
        //这时候获取密码钥匙
        that.getpwdkey()
    }})
  },
  getpwdkey(){
    var that=this
    that.setData({given2:[]})
    wx.request({
      url: backurl + '/pwdkey/getroomkey/'+that.data.rid,
      method: 'GET',
      success(res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var rs=[]
          for (var i = 0; i < res.data.data.length; i++) {
            // console.log(res.data.data[i])
            rs.push(res.data.data[i])
          }
          that.setData({
            given2:rs
          })
        }
        console.log(that.data.given2)
    }})
  },
  delepwdkey(e){
    var that=this
    console.log(e)
    Dialog.confirm({
      title: '提示',
      message: '是否确定取消该密码钥匙？'
    })
      .then(() => {
        wx.request({
          url: backurl + '/pwdkey/deletebypid/'+e.currentTarget.dataset.pid,
          method: 'DELETE',
          success(res) {
            if (res.data.code == 1) {
              Toast(res.data.msg)
              that.flash()
            }
            else{
              Toast(res.data.msg)
            }
        }})
      })
      .catch(() => {
        
      });
  },
  todelete(e){
    var that=this
    console.log(e)
    Dialog.confirm({
      title: '提示',
      message: '您长按了'+e.currentTarget.dataset.who+'是否取消给他的钥匙权限？'
    })
      .then(() => {
        wx.request({
          url: backurl + '/orders/deletegiven/'+e.currentTarget.dataset.ordid,
          method: 'DELETE',
          success(res) {
            if (res.data.code == 1) {
              Toast(res.data.msg)
              that.flash()
            }
            else{
              Toast(res.data.msg)
            }
        }})
      })
      .catch(() => {
        
      });
  }
 
})