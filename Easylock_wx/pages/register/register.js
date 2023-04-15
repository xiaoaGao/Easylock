import Toast from '@vant/weapp/toast/toast';
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    username:'',
    passwd:'',
    realname:'',
    idnum:'',
    phone:'',
    gender:'',
    status:0,
    can:true
  },

  onLoad(options) {
    this.setData({
      username:'',
    passwd:'',
    realname:'',
    idnum:'',
    phone:'',
    status:0,
    can:true
    })
  },
  onChangesf(event) {//选择登陆身份
    this.setData({
      status: event.detail,
    });
    var that=this.data;
    if(that.username!=''&&that.passwd!=''&&that.realname!=''&&that.idnum!=''&&that.phone!=''&&that.status!=0&&that.gender!=''){
      this.setData({
        can:false
      })
    }else{
      this.setData({
        can:true
      })
    }
  },
  onChangesex(event) {//选择性别
    this.setData({
      gender: event.detail,
    });
    var that=this.data;
    if(that.username!=''&&that.passwd!=''&&that.realname!=''&&that.idnum!=''&&that.phone!=''&&that.status!=0&&that.gender!=''){
      this.setData({
        can:false
      })
    }else{
      this.setData({
        can:true
      })
    }
  },
  onComp(){
    var that=this.data;
    if(that.username!=''&&that.passwd!=''&&that.realname!=''&&that.idnum!=''&&that.phone!=''&&that.status!=0&&that.gender!=0){
      this.setData({
        can:false
      })
    }else{
      this.setData({
        can:true
      })
    }
  },
  regist(){
    var that=this;
    if(that.data.status==1){//房客注册
      wx.request({
        url: backurl+'/customer/register',
        method:'POST',
        data:{
          username:that.data.username,
          passwd:that.data.passwd,
          realname:that.data.realname,
          idnum:that.data.idnum,
          phone:that.data.phone,
          gender:that.data.gender
        },
        success(res){
          console.log(res.data);
          // Toast(res.data.msg);
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
    else if(that.data.status==2){//房东注册
      wx.request({
        url: backurl+'/owner/register',
        method:'POST',
        data:{
          username:that.data.username,
          passwd:that.data.passwd,
          realname:that.data.realname,
          idnum:that.data.idnum,
          phone:that.data.phone,
          gender:that.data.gender
        },
        success(res){
          console.log(res.data);
          // Toast(res.data.msg);
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
  }
})