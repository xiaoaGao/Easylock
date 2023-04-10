import Toast from '@vant/weapp/toast/toast';
Page({

  data: {
    username:'',
    password:'',
    status: 0
  },

  onLoad(options) {
    this.setData({
      username:'',
      password:'',
      status:0
    });
  },

  onChange(event) {//选择登陆身份
    this.setData({
      status: event.detail,
    });
  },
  login(){
    //登陆
    console.log(this.data.status);
    var sta=this.data.status;
    if(sta==1){//房客
      console.log(this.data.status);
      wx.navigateTo({
        url: '../../pages/shouye/shouye',
      })
    }
    else if(sta==2){//房东
      wx.navigateTo({
        url: '/pages/calculator/calculator',
      })
    }
    else{
      Toast('请选择登陆身份！');
    }
  }
})