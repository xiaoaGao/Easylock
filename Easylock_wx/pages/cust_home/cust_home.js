import Toast from '@vant/weapp/toast/toast';

const app = getApp();
const backurl = app.globalData.backurl;
const service_Id = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'; //服务UUID
const notify_Id = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'; //notify特征值UUID
const write_Id = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'; //write特征值UUID
Page({

  data: {
    keys: [],
    password:'',
    deviceId:'',
    oid:'',
    randomcode:'',
    dd:'',
    rid:''
  },

  onLoad() {
    var that = this
    that.flash()
    console.log(that.data.keys)
  },
  flash() {
    //刷新页面
    var that = this
    var me = wx.getStorageSync('me')
    wx.request({
      url: backurl + '/customer/getmyroom',
      method: 'GET',
      data: {
        phone: me.phone
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1) {
          that.setData({
            keys: res.data.data
          })
        } else {

        }
      }
    })
  },
  tocsroom(e) {
      wx.navigateTo({
        //带参数跳转到其他页面
        url: '../csroom/csroom?oid='+e.currentTarget.dataset.oid+"&roomnum="+e.currentTarget.dataset.roomnum+"&deviceid="+e.currentTarget.dataset.deviceid+"&ordid="+e.currentTarget.dataset.ordid+"&standard="+e.currentTarget.dataset.standard+"&jieshao="+e.currentTarget.dataset.jieshao+"&location="+e.currentTarget.dataset.location+"&rid="+e.currentTarget.dataset.rid+"&ready="+e.currentTarget.dataset.ready+"&end="+e.currentTarget.dataset.end
      })
  },
  pwdunlock(){
    var that=this
    wx.request({
      url: backurl + '/pwdkey/pwdunlock',
      method: 'POST',
      data:{
        password:that.data.password
      },
      success(res) {
        console.log(res)
        if (res.data.code == 1) {
          Toast('开始开锁')
          that.setData({
            deviceId:res.data.data.deviceid,
            oid:res.data.data.oid,
            rid:res.data.data.rid
          })
          // 这里开锁
          that.bleInit()
        }
        else{
          Toast(res.data.msg)
        }
    }})
  },
  // 每个tabbar页面要加
  onShow: function () {
    this.getTabBar().init(0);
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
              type: 2,
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