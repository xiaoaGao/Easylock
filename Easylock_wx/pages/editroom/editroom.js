import Toast from '@vant/weapp/toast/toast';
const app = getApp();
const backurl = app.globalData.backurl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomnum:'',
    standard:'',
    jieshao:'',
    columns: ['大床房', '双床房', '电竞房', '大套房'],
    show:false,
    rid:''
  },

  onClose() {
    //关闭选择器
    this.setData({ show: false });
  },
  toshow(){
    this.setData({
      show:true
    })
 
  },
  onConfirm(event) {
    const { picker, value, index } = event.detail;
    // console.log(`当前值：${value}, 当前索引：${index}`);

    this.setData({
      standard:value,
      show:false
    })

  },
  onAdd(){
    var that=this;
    if(that.data.roomnum==''||that.data.standard==''){
      Toast("必填项未填写");
    }
    else{
      wx.request({
        url: backurl+'/aroom/xiugai',
        method: 'POST',
        data: {
          rid:that.data.rid,
          roomnum:that.data.roomnum,
          standard:that.data.standard,
          jieshao:that.data.jieshao,
        },
        success(res) {
          console.log(res);
          if (res.data.code == 1) {
            Toast({
              message: res.data.msg,
              onClose: () => {
                wx.navigateBack()
              },
            });
          } else {
            Toast(res.data.msg);
          }
        }
      })
    }
  },
  onLoad: function (options) {       //options用于接收上个页面传递过来的参数
      var that = this;
      that.setData({ 
      rid:options.rid,
     roomnum:options.roomnum,
     standard:options.standard,
      jieshao:options.jieshao
      })

      }

  
})