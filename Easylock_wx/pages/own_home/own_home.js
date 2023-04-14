Page({

  data: {
    zaizhu:1,
    kongfang:2,
    fangyuans:[
      // {fid:1,
      //   fname:"清华苑",
      // arooms:["101",102]
      // },
      // {fid:2,
      //   fname:"钱江湾",
      // arooms:["101",102]
      // }
    ],
    activeNames: ['1'],
  },

  //每个tabbar页面要加
  onShow: function () {
    console.log('mine')
    this.getTabBar().init(0);
  },
  onLoad:function(){
    var that=this;
    var me=wx.getStorageSync('me');
    wx.request({
      //获取用户的所有房源小区
      url: 'http://localhost:9090/fangyuan/findallfang/'+me.oid,
      method: 'GET',
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          // console.log(res.data.data.length)
          var fs=[]
          for (var i = 0; i < res.data.data.length; i++) {
            fs.push({
              fid:res.data.data[i].fid,
              fname:res.data.data[i].fname,
              arooms:[]
            })
          }
          console.log(fs)
          that.setData({
            fangyuans:fs
          })
        }
      }
    })
    wx.request({
      //获取用户的所有房间
      url: 'http://localhost:9090/aroom/getAllroom/'+me.oid,
      method: 'GET',
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          console.log(res.data)
          var rs=that.data.fangyuans;
          for (var i = 0; i < res.data.data.length; i++) {
            rs.forEach((fang,idx)=>{
              // console.log(fang)
                if(fang.fid==res.data.data[i].fid){
                  fang.arooms.push({
                    roomnum:res.data.data[i].roomnum,
                    state:res.data.data[i].state
                  })
                  // console.log(res.data.data[i].roomnum)
                }
            })
          }
          that.setData({
            fangyuans:rs
          })
          console.log(that.data.fangyuans)
        }
      }
    })
  },
  loadall(){
    
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onClickLeft(){
    wx.navigateTo({
      url: '../addfang/addfang',
    })
  },
  onClickRight(){

  },
  toaddroom(e){
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../addroom/addroom?fid='+e.currentTarget.dataset.fid,
    })
  // console.log(e.currentTarget.dataset.fid)
  }
})