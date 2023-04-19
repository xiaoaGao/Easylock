const app = getApp();
const backurl = app.globalData.backurl;
const map = new Map()
Page({

  data: {
    zaizhu: 0,
    kongfang: 0,
    fangyuans: [
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

    console.log('onshow')
    this.getTabBar().init(0);
    this.loadall()
  },

  shuaxin() {
    this.loadall()
  },
  loadall() {
    this.setData({
      fangyuans: [],
      zaizhu: 0,
      kongfang: 0
    })
    this.loadfang();
  },
  loadfang() {
    var that = this;
    var me = wx.getStorageSync('me');
    wx.request({
      //获取用户的所有房源小区
      url: backurl + '/fangyuan/findallfang/' + me.oid,
      method: 'GET',
      success(res) {
        // console.log(res)
        if (res.data.code == 1) {
          // console.log(res.data.data.length)
          var fs = []
          for (var i = 0; i < res.data.data.length; i++) {
            fs.push({
              fid: res.data.data[i].fid,
              fname: res.data.data[i].fname,
              arooms: []
            })
          }
          // console.log(fs)
          that.setData({
            fangyuans: fs
          })
        }
        //解决异步问题
        // that.getdemands();
        that.loadroom();
      }
    })
  },
  loadroom() {
    var that = this;
    var me = wx.getStorageSync('me');
    wx.request({
      //获取用户的所有房间
      url: backurl + '/aroom/getAllroom/' + me.oid,
      method: 'GET',
      success(res) {
        // console.log(res)

        if (res.data.code == 1) {
          // console.log(res.data)
          var rs = that.data.fangyuans;
          for (var i = 0; i < res.data.data.length; i++) {
            rs.forEach((fang, idx) => {
              // console.log(fang)
              if (fang.fid == res.data.data[i].fid) {
                fang.arooms.push({
                  rid: res.data.data[i].rid,
                  roomnum: res.data.data[i].roomnum,
                  state: res.data.data[i].state,
                  
                })
                if (res.data.data[i].state == 1)
                  that.setData({
                    zaizhu: that.data.zaizhu + 1
                  })
                else
                  that.setData({
                    kongfang: that.data.kongfang + 1
                  })
                // console.log(res.data.data[i].roomnum)
              }
            })
          }
          that.setData({
            fangyuans: rs
          })
          console.log(that.data.fangyuans)
        }
      }
    })
  },
  // getdemands(){
  //   var that=this
  //   var me=wx.getStorageSync('me')
  //   wx.request({
  //     //获取用户的所有房间
  //     url: backurl + '/demand/getdemands/' + me.oid,
  //     method: 'GET',
  //     success(res) {
  //       if(res.data.code==1){
  //         for(var i=0;i<res.data.data.length;i++){
  //           map.set(res.data.data[i].rid,true)//将有搜到请求的房间加入map
  //         }
  //         console.log(map)
  //       }
  //       that.loadroom();
  //     }
  //   })
  // },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onClickLeft() {
    wx.navigateTo({
      url: '../addfang/addfang',
    })
  },
  onClickRight() {

  },
  toroom(e) {
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../room/room?rid=' + e.currentTarget.dataset.rid + "&roomnum=" + e.currentTarget.dataset.roomnum
    })
  },
  toaddroom(e) {
    wx.navigateTo({
      //带参数跳转到其他页面
      //pagetype=1表示增加房间跳转
      url: '../addroom/addroom?fid=' + e.currentTarget.dataset.fid,
    })
    // console.log(e.currentTarget.dataset.fid)
  }
})