
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    roomnum:'',
    rid:'',
  },

 onLoad:function(options){
  //  console.log(options)
  var that = this;
  that.setData({ 
 rid: options.rid,     
 roomnum:options.roomnum
  })
 },
 tobind(){
   var that=this;
  wx.navigateTo({
    //带参数跳转到其他页面
    url: '../bindroom/bindroom?rid='+that.data.rid+'&roomnum='+that.data.roomnum
  })
 }
})