const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    rid:'',
    totalcust:1,
    active: 0,
    customers:[
      {phone:'11',
      realname:'111',
      idnum:'1111'}
    ]
  },

  onLoad(options) {
    var that = this;
    that.setData({
      rid: options.rid
    })
  },
  stepchange(e){
    //步进器改变
    console.log(e.detail);
    var cs=this.data.customers
    // for(var i=cs.length()-1;i<e.detail;i++){
    //   cs.push({
    //     phone:'',
    //     realname:'',
    //     idnum:''
    //   })
    // }
    while(cs.length!=e.detail){ 
      if(cs.length<e.detail){
        cs.push({
          phone:'',
          realname:'',
          idnum:''
        })
      }
      else{
        cs.pop()
      }
    }
    this.setData({
      totalcust:e.detail,
      customers:cs
    })
    console.log(cs)
  },
  onComp(e){
    //输入内容后触发
    var that=this;
    console.log(e)
    var index=e.currentTarget.dataset.which[0]
    console.log(index)
    // var cust=that.data.customers[index]
    var cs=that.data.customers
    console.log(cs)
    if(e.currentTarget.dataset.which[1]==0){
      //手机号
      cs[index].phone=e.detail
    }
    else if(e.currentTarget.dataset.which[1]==1){
      //真名
      cs[index].realname=e.detail
    }
    else{
      //身份证
      cs[index].idnum=e.detail
    }
    that.setData({
      customers:cs
    })
    
  },
})