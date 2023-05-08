import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
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
    end:'',
    validtimes:1,

    minDate: new Date().getTime(),

    currentDate: new Date().getTime(),
    startpicshow:false,
    endpicshow:false,
    starttime:'',
    endtime:'',
    starttimeformat:'',
    endtimeformat:'',
  },

  onLoad(options) {
    var that = this;
    that.setData({
      rid: options.rid
    })
    
  },
  //时间选择器
  // onstart(event) {
  //   //精准时间选择器，时分秒
  //   this.setData({
  //     starttime: event.detail,
  //   });
  // },
  // onend(event) {
  //   //精准时间选择器，时分秒
  //   this.setData({
  //     endtime: event.detail,
  //   });
  // },
  closedatepicker(){
    var that= this
    that.setData({
      startpicshow:false,
      endpicshow:false
    })
  },
  confirmstart(event){
    var that= this
    that.setData({
      startpicshow:false,
      endpicshow:false,
      starttimeformat:that.formatDateTime(event.detail)
    })
  },
  confirmend(event){
    var that= this
    that.setData({
      startpicshow:false,
      endpicshow:false,
      endtimeformat:that.formatDateTime(event.detail)
    })
  },
  // confirmstart(){
  //   var that= this
  //   that.setData({
  //     startpicshow:false,
  //     endpicshow:false,
  //     starttimeformat:that.formatDateTime(that.data.starttime)
  //   })
  //   console.log(that.data.starttime)
  // },
  // confirmend(){
  //   var that= this
  //   that.setData({
  //     startpicshow:false,
  //     endpicshow:false,
  //     endtimeformat:that.formatDateTime(that.data.endtime)
  //   })
  //   console.log(that.data.endtime)
  // },
  Displaystartpick(){
    var that=this
    that.setData({
      startpicshow:true,
      endpicshow:false
    })
  },
  Displayendpick(){
    var that=this
    that.setData({
      startpicshow:false,
      endpicshow:true
    })
  },
  //有效次数选择
  validtimechange(e){
    var that = this
    that.setData({
      validtimes:e.detail
    })
  },
  newrandomkey(){
    //生成随机密码
    var that = this
    if(that.data.starttimeformat==''||that.data.endtimeformat=='')
    {
      Toast('请选择时间！')
      return
    }
    if(that.data.starttime>that.data.endtime)
    {
      Toast('开始时间不能晚于结束时间')
      return
    }
    wx.request({
      url: backurl + '/pwdkey/newpwdkey',
      method: 'POST',
      data:{
        rid:that.data.rid,
        starttime:that.data.starttimeformat,
        endtime:that.data.endtimeformat,
        times:that.data.validtimes
      },
      success(res) {
        if (res.data.code == 1) {
          Dialog.alert({
            message: '随机密码为：'+res.data.msg,
            theme: 'round-button',
          }).then(() => {
            wx.navigateBack()
          });
        }else{
          Toast(res.data.msg)
        }

      }
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
        else{
          Toast(res.data.msg)
        }
    }})
  },
  validPhone(phone) { //判断手机号是否合法
    if (
      !/^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/.test(
        phone
      )
    ) {
      return false
    } else {
      return true
    }
  },
  validIdCard(idCard) {
    // 15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
      if (idCard.length === 18) {
        return true
      //   // eslint-disable-next-line no-array-constructor
      //   var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2) // 将前17位加权因子保存在数组里
      //   // eslint-disable-next-line no-array-constructor
      //   var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2) // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
      //   var idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
      //   for (var i = 0; i < 17; i++) {
      //     idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
      //   }
      //   var idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
      //   var idCardLast = idCard.substring(17) // 得到最后一位身份证号码
      //   // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      //   if (idCardMod === 2) {
      //     // eslint-disable-next-line eqeqeq
      //     if (idCardLast == 'X' || idCardLast == 'x') {
      //       return true
      //     } else {
      //       return false
      //     }
      //   } else {
      //     // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
      //     // eslint-disable-next-line eqeqeq
      //     if (idCardLast == idCardY[idCardMod]) {
      //       return true
      //     } else {
      //       return false
      //     }
      //   }
      }
    } else {
      return false
    }
  },
})