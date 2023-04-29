import Toast from '@vant/weapp/toast/toast';
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    username: '',
    passwd: '',
    realname: '',
    idnum: '',
    phone: '',
    gender: '',
    status: 0,
    can: true,

  },

  onLoad(options) {
    this.setData({
      username: '',
      passwd: '',
      realname: '',
      idnum: '',
      phone: '',
      status: 0,
      can: true,
      phonelegal: true,
      idnumlegal: true,
      passwdlegal: true
    })
  },
  onChangesf(event) { //选择登陆身份
    this.setData({
      status: event.detail,
    });
    var that = this.data;
    if (that.username != '' && that.passwd != '' && that.realname != '' && that.idnum != '' && that.phone != '' && that.status != 0 && that.gender != '') {
      this.setData({
        can: false
      })
    } else {
      this.setData({
        can: true
      })
    }
  },
  onChangesex(event) { //选择性别
    this.setData({
      gender: event.detail,
    });
    var that = this.data;
    if (that.username != '' && that.passwd != '' && that.realname != '' && that.idnum != '' && that.phone != '' && that.status != 0 && that.gender != '') {
      this.setData({
        can: false
      })
    } else {
      this.setData({
        can: true
      })
    }
  },
  onComp() {
    var that = this.data;
    if (that.username != '' && that.passwd != '' && that.realname != '' && that.idnum != '' && that.phone != '' && that.status != 0 && that.gender != 0) {
      this.setData({
        can: false
      })
    } else {
      this.setData({
        can: true
      })
    }
  },
  regist() {
    var that = this;
    console.log("click")
    var phoneleg = that.validPhone(that.data.phone)
    var idnumleg = that.validIdCard(that.data.idnum)
    var passwdleg = that.validPassword(that.data.passwd)
    if (phoneleg && idnumleg && passwdleg) {
      if (that.data.status == 1) { //房客注册
        wx.request({
          url: backurl + '/customer/register',
          method: 'POST',
          data: {
            username: that.data.username,
            passwd: that.data.passwd,
            realname: that.data.realname,
            idnum: that.data.idnum,
            phone: that.data.phone,
            gender: that.data.gender
          },
          success(res) {
            console.log(res.data);
            // Toast(res.data.msg);
            if (res.data.code == 1) {
              Toast({
                message: res.data.msg,
                onClose: () => {
                  wx.navigateBack()
                },
              });
            } else {
              Toast(res.data.msg);
            }
          }
        })
      } else if (that.data.status == 2) { //房东注册
        wx.request({
          url: backurl + '/owner/register',
          method: 'POST',
          data: {
            username: that.data.username,
            passwd: that.data.passwd,
            realname: that.data.realname,
            idnum: that.data.idnum,
            phone: that.data.phone,
            gender: that.data.gender
          },
          success(res) {
            console.log(res.data);
            // Toast(res.data.msg);
            if (res.data.code == 1) {
              Toast({
                message: res.data.msg,
                onClose: () => {
                  wx.navigateBack()
                },
              });
            } else {
              Toast(res.data.msg);
            }
          }
        })
      }
    } else {
      that.setData({
        phonelegal: phoneleg
      })
      that.setData({
        idnumlegal: idnumleg
      })
      that.setData({
        passwdlegal: passwdleg
      })
    }

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
  // 8-16位必须包含数字、字母
  validPassword(password) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^(?=.*[a-zA-Z])(?=.*\d).{8,16}/
    return reg.test(password)
  }
})