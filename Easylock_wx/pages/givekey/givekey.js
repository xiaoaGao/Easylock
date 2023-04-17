import Toast from '@vant/weapp/toast/toast';

const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    rid:'',
    totalcust:1,
    active: 0,
    customers:[
      {phone:'',
      realname:'',
      idnum:''}
    ],
    calendarshow: false,
    day:'',//string
    start:'',//date
    end:''
  },

  onLoad(options) {
    var that = this;
    that.setData({
      rid: options.rid
    })
  },
  //日期选择器
  DisplayCalendar(){
    this.setData({ calendarshow: true });
  },
  onClose() {
    this.setData({ calendarshow: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    var that=this
    const [start, end] = event.detail;
    this.setData({
      calendarshow: false,
      day: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    });
    start.setHours(14)
    start.setMinutes(0)
    start.setSeconds(0)//设置起始时间从14点开始入住
    end.setHours(12)
    end.setMinutes(0)
    end.setSeconds(0)//设置结束时间从12点离开
    that.setData({
      start: start,
      end: end
    });
    console.log(end)
    console.log(that.formatDateTime(end))
    // console.log(this.data.day)

  },
  //日期选择器end

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
    //这个while写的太帅了嘿嘿
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
    //完成添加房客数量功能，不损失输入数据
    //输入内容后触发
    var that=this;
    // console.log(e)
    var index=e.currentTarget.dataset.which[0]
    // console.log(index)
    // var cust=that.data.customers[index]
    var cs=that.data.customers
    // console.log(cs)
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
  isnotfull(o){
    //判断数组是否填完整
    for(var i=0;i<o.length;i++){
      if(o[i].phone==''|| o[i].realname==''|| o[i].idnum==''){
        return true
      }
    }
    return false
  },
  //格式化时间方法
   formatDateTime(d) {
    var date = new Date(d)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minu = date.getMinutes()
    var sec = date.getSeconds()

    month = month >= 10 ? month : '0' + month
    day = day >= 10 ? day : '0' + day
    hour = hour >= 10 ? hour : '0' + hour
    minu = minu >= 10 ? minu : '0' + minu
    sec = sec >= 10 ? sec : '0' + sec

    return `${year}-${month}-${day} ${hour}:${minu}:${sec}`
  },
  give(){
    //确定分发钥匙
    var that=this
    if(that.data.start==''||that.data.start==''||that.data.end==''||that.isnotfull(that.data.customers)){
        Toast("内容不完整，请补全！")
        return
    }
    // console.log(that.formatDateTime(that.data.end, 'yyyy-MM-dd hh:mm:ss'))
    wx.request({
      url: backurl + '/orders/givekey',
      method: 'POST',
      data:{
        rid:that.data.rid,
        customers:that.data.customers,
        start:that.formatDateTime(that.data.start),
        end:that.formatDateTime(that.data.end)
      },
      success(res) {
        if (res.data.code == 1) {
            console.log(that.formatDateTime(that.data.start))
            const pages = getCurrentPages();
            // const currPage = pages[pages.length - 1]; //当前页面
            const prePage = pages[pages.length - 2]; //上一个页面 
            /**
             * 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
             * 不需要页面更新
             */
            // console.log(pages)
            prePage.setData({
              type: 2
            })
            wx.navigateBack() //返回上一层
        } 
    }})
  }
})