Component({
  data: {
      active: 0,
      own_list:[{
        
          icon: 'home-o',
          text: '房源',
          url: '../own_home/own_home'
      },{
          icon: 'user-o',
          text: '我',
          url: '../mine/mine'
      }
      ],
      cust_list:[
        {
          icon: 'lock',
          text: '钥匙',
          url: '../cust_home/cust_home'
      },{
        icon: 'user-o',
          text: '我',
          url: '../mine/mine'
      }
      ],
      list: []
  },
  attached(){
    const that=this;
    const status=wx.getStorageSync('status');
    if(status==1){
      that.setData({
        list:that.data.cust_list
      })
    }
    else{
      that.setData({
        list:that.data.own_list
      })
    }
  },
  methods: {
      onChange(event) {
    this.setData({ active: event.detail });
          wx.switchTab({
              url: this.data.list[event.detail].url
          });
      },

      init(i) {
    const page = getCurrentPages().pop();
          this.setData({
              active: i
          });
      }
  }
});