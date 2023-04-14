import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    fname:'',
    location:'',
    can:true
  },

  onLoad(options) {
    this.setData({
      fname:'',
    location:'',
    can:true
    })
  },

  onComp(){
    var that=this.data;
    if(that.fname!=''&&that.location!=''){
      this.setData({
        can:false
      })
    }else{
      this.setData({
        can:true
      })
    }
  },
  addfang(){
    var that=this;
    var me=wx.getStorageSync('me')
      wx.request({
        url: 'http://localhost:9090/fangyuan/addfang',
        method:'POST',
        data:{
          oid:me.oid,
          fname:that.data.fname,
          location:that.data.location
        },
        success(res){
          console.log(res.data);
          if(res.data.code==1){
            Toast({
              message: res.data.msg,
              onClose: () => {
                wx.navigateBack()
              },
            });
          }
          else{
            Toast(res.data.msg);
          }
        }
      })
    }
   
  
})