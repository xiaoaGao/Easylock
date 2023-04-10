// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    username:'',
    password:'',
    status:0,//1表示房客2表示房东
    hid:false,
  },

  onLoad(options) {
    this.setData({
      username:'',
      password:'',
      status: 0,
      hid:false,
    });
  },

  onChange(event) {//选择登陆身份
    this.setData({
      status: event.detail,
    });
  },
  login(){
    //登陆
    console.log("11");
    if(this.status==0){
      this.hid=true;
    }
  }
})