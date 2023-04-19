import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
const backurl = app.globalData.backurl;
const service_Id = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'; //服务UUID
const notify_Id = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'; //notify特征值UUID
const write_Id = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'; //write特征值UUID
Page({

  data: {
    oid: '',
    rid: '',
    ordid: '',
    standard: '',
    jieshao: '',
    location: '',
    roomnum: '',
    deviceId: '',
    randomcode: '',
    dd: '',
    ready: '',
    end: '',
    xuzhu: false,
    fuwu: false,
    dtype: 0,
    prolongday: 1,
    longto: ''
  },

  onLoad: function (options) {
    //  console.log(options)
    var that = this;
    that.setData({
      oid: options.oid,
      roomnum: options.roomnum,
      deviceId: options.deviceid,
      ordid: options.ordid,
      standard: options.standard,
      jieshao: options.jieshao,
      location: options.location,
      rid: options.rid,
      ready: options.ready,
      end: options.end
    })
    console.log(that.data.end)

  },
  onShow: function (options) {
    var that = this
  },
  stepchange(e) {
    //步进器改变
    var that=this
    var date=new Date(that.data.end)
    date=date.setDate(date.getDate()+e.detail);//加e天
    // console.log(date)
    var d=that.formatDateTime(date)
    this.setData({
      prolongday: e.detail,
      longto:d
    })
    console.log(that.data.prolongday)
  },
  unlock() {
    console.log('unlock')
    var that = this
    that.bleInit()
  },
  showxuzhu() {
    this.setData({
      xuzhu: true
    })
  },
  confirmprolong() {
    //请求续住
    var that=this
    wx.request({
      url: backurl + '/demand/prolongdemand',
      method: 'POST',
      data: {
        dtype: 1,
        note:that.data.prolongday,
        ordid: that.data.ordid
      },
      success(res) {
        console.log(res);
        Toast(res.data.msg)
      }
    })
  },
  tomydemand(){
    var that=this
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../mydemand/mydemand?ordid='+that.data.ordid
    })
  },
  onUnload() {
    //断开蓝牙连接
    var that = this
    wx.closeBLEConnection(that.data.dd)
    //关闭蓝牙适配器
    wx.closeBluetoothAdapter()
  },

  showfuwu() {
    this.setData({
      fuwu: true
    })
  },
  confirmfuwu() {
    var that = this
    wx.request({
      url: backurl + '/demand/otherdemand',
      method: 'POST',
      data: {
        dtype: that.data.dtype,
        ordid: that.data.ordid
      },
      success(res) {
        console.log(res);
        Toast(res.data.msg)
      }
    })
  },
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
  //蓝牙BLE模块
  bleInit() {
    console.log('searchBle')
    var that = this
    that.setData({
      dd: that.data.deviceId
    })
    // 监听扫描到新设备事件
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach((device) => {
        // 这里可以做一些过滤
        console.log('Device Found', device)

        if (device.deviceId == that.data.deviceId) {
          // 找到设备开始连接
          this.bleConnection(device.deviceId);
          wx.stopBluetoothDevicesDiscovery()
        }
      })

    })

    // 初始化蓝牙模块
    wx.openBluetoothAdapter({
      mode: 'central',
      success: (res) => {
        // 开始搜索附近的蓝牙外围设备
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: false,
        })
      },
      fail: (res) => {
        if (res.errCode !== 10001) return
        wx.onBluetoothAdapterStateChange((res) => {
          if (!res.available) return
          // 开始搜寻附近的蓝牙外围设备
          wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: false,
          })
        })
      }
    })
    wx.onBLECharacteristicValueChange((result) => {
      //特征值变化

      console.log('收到了：', result.value)
      let hex = that.ab2hex(result.value)
      console.log('转成字符：', that.hextoString(hex))
      let res = that.hextoString(hex)
      // console.log('长度'+res.length)
      // console.log('res[0]'+res[0])
      if (res.length == 2) {
        console.log('随机验证码：' + res)
        //收到了验证码
        that.setData({
          randomcode: res.slice(0, 2)
        })
        //这时候再发绑定消息
        //绑定门锁协议，传入房间号
        var me = wx.getStorageSync('me')
        //开门操作
        var msg = that.data.randomcode + 'ulk' + that.data.oid
        var buffer = that.stringToBytes(msg)
        console.log('发送' + msg)
        wx.writeBLECharacteristicValue({
          deviceId: that.data.dd,
          serviceId: service_Id,
          characteristicId: write_Id,
          value: buffer,
        })
      } else {
        console.log('收到锁动作应答：' + res)
        if (res === 'error1') {
          console.log('随机验证码错误')
          Toast('失败！')
        } else if (res === 'ulksuccess') {
          console.log('开门成功')
          Toast('门已开')
          //这时候再请求后端
          var me = wx.getStorageSync('me')
          wx.request({
            url: backurl + '/unlockrecord/unlock',
            method: 'POST',
            data: {
              rid: that.data.rid,
              type: 1,
              realname: me.realname,
              phone: me.phone
            }
          })
        }
        //断开蓝牙连接
        wx.closeBLEConnection(that.data.deviceId)
        //关闭蓝牙适配器
        wx.closeBluetoothAdapter()
      }
    })
  },
  bleConnection(deviceId) {
    var that = this
    wx.createBLEConnection({
      deviceId, // 搜索到设备的 deviceId
      success: () => {
        // 连接成功
        console.log('连接成功')

        //连接成功后，监听订阅notify
        // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
        wx.notifyBLECharacteristicValueChange({
          deviceId,
          serviceId: service_Id,
          characteristicId: notify_Id,
          state: true,
        })
        console.log('订阅成功')
        setTimeout(function () {
          //订阅成功后，等待半秒开始通信,获取随机验证码
          var buffer = that.stringToBytes("getid") //字符串转字节
          wx.writeBLECharacteristicValue({
            deviceId,
            serviceId: service_Id,
            characteristicId: write_Id,
            value: buffer,
          })
        }, 500)
      }
    })
  },

  stringToBytes(str) {
    var array = new Uint8Array(str.length);
    for (var i = 0, l = str.length; i < l; i++) {
      array[i] = str.charCodeAt(i);
    }
    console.log(array);
    return array.buffer;
  },
  hextoString: function (hex) {
    var arr = hex.split("")
    var out = ""
    for (var i = 0; i < arr.length / 2; i++) {
      var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
      var charValue = String.fromCharCode(tmp);
      out += charValue
    }
    return out
  },
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },
})