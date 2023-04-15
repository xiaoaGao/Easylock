
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
 }
})