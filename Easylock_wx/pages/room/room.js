import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
const backurl = app.globalData.backurl;
const service_Id = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'; //服务UUID
const notify_Id = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'; //notify特征值UUID
const write_Id = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'; //write特征值UUID
Page({

  data: {
    roomnum: '',
    rid: '',
    type: 0,
    deviceId: '',
    isbind: true,
    bletype: 0,
    standard: '',
    jieshao: '',
    randomcode: '',
    dd: '',
    totaldemands: 0,
  },

  onLoad: function (options) {
    //  console.log(options)
    var that = this;
    that.setData({
      rid: options.rid,
      roomnum: options.roomnum,

    })

  },
  onShow: function (options) {
    var that = this
    that.flash()
    if (that.data.type == 1) {
      //从绑定门锁中成功返回
      Toast('绑定成功！');
      that.data.type = 0;
    } else if (that.data.type == 2) {
      //从绑定门锁中成功返回
      Toast('分发钥匙成功！');
      that.data.type = 0;
    }

  },
  torecord() {
    //到开门记录
    var that = this;
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../record/record?rid=' + that.data.rid
    })
  },
  tobind() {
    //到绑定界面
    var that = this;
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../bindroom/bindroom?rid=' + that.data.rid + '&roomnum=' + that.data.roomnum
    })
  },
  deleteroom() {
    //删除房间
    var that = this
    // if(that.data.isbind){
    //   Toast('请先解除绑定！')
    // }
    Dialog.confirm({
        title: '提示',
        message: '删除操作不可恢复，确定删除这个房间吗？门锁可以通过按钮初始化',
      })
      .then(() => {
        wx.request({
          url: backurl + '/aroom/deleteroom/' + that.data.rid,
          method: 'DELETE',
          success(res) {
            if (res.data.code == 1) {
              wx.navigateBack()
            } else {
              Toast(res.data.msg)
            }
          }
        })
      })
      .catch(() => {

      });

  },
  toeditroom() {
    //修改房间信息
    var that = this
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../editroom/editroom?rid=' + that.data.rid + '&roomnum=' + that.data.roomnum + '&standard=' + that.data.standard + '&jieshao=' + that.data.jieshao,
    })
  },
  unbind() {
    var that = this
    Dialog.confirm({
        title: '提示',
        message: '确定解除绑定且身处锁边吗？',
      })
      .then(() => {
        that.setData({
          bletype: 1
        }) //设置蓝牙操作为解绑
        that.bleInit()
      })
      .catch(() => {

      });

  },
  unlock() {
    var that = this
    that.setData({
      bletype: 2
    }) //设置蓝牙操作为开门
    that.bleInit()

  },
  togivekey() {
    var that = this
    //分配钥匙
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../givekey/givekey?rid=' + that.data.rid
    })
  },
  togiven() {
    var that = this
    //查看已发钥匙
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../given/given?rid=' + that.data.rid
    })
  },
  onUnload() {
    //断开蓝牙连接
    var that = this
    wx.closeBLEConnection(that.data.dd)
    //关闭蓝牙适配器
    wx.closeBluetoothAdapter()
  },
  getdemand() {
    //获取这个房间的请求
    var that = this
    wx.request({
      url: backurl + '/demand/getroomdemand/' + that.data.rid,
      method: 'GET',
      success(res) {
        if (res.data.code == 1) {
          wx.setStorageSync(that.data.rid, res.data.data)
          that.setData({
            totaldemands: res.data.data.length
          })
          console.log(wx.getStorageSync(that.data.rid))

        }

      }
    })
  },
  //刷新页面
  flash() {
    var that = this
    //  console.log(options)
    wx.request({
      url: backurl + '/aroom/getroom/' + that.data.rid,
      method: 'GET',
      success(res) {
        console.log(res.data)
        if (res.data.code === '1') {
          that.setData({
            deviceId: res.data.data.deviceid,
            standard: res.data.data.standard,
            roomnum: res.data.data.roomnum,
            jieshao: res.data.data.jieshao,
            isbind: true
          })

        } else {
          that.setData({
            standard: res.data.data.standard,
            roomnum: res.data.data.roomnum,
            jieshao: res.data.data.jieshao,
            isbind: false
          })
        }
        console.log(that.data.isbind)
        that.getdemand()
      }
    })
  },
  todemands() {
    var that =this
    //到房客请求界面
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../roomdemands/roomdemands?rid='+that.data.rid
    })
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
        if (that.data.bletype == 1) {
          //解绑操作
          var msg = that.data.randomcode + 'ub' + me.oid
          var buffer = that.stringToBytes(msg)
        } else if (that.data.bletype == 2) {
          //开门操作
          var msg = that.data.randomcode + 'ulk' + me.oid
          var buffer = that.stringToBytes(msg)
        }
        that.setData({
          bletype: 0
        })
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
        } else if (res === 'ubdsuccess') {
          console.log('解绑成功')
          Toast('解绑成功')
          //这时候再请求后端
          wx.request({
            url: backurl + '/aroom/unbind/' + that.data.rid,
            method: 'POST',
            success(res) {
              if (res.data.code == 1) {
                that.setData({
                  deviceId: '',
                  isbind: false
                })
                Toast(res.data.msg)
              }
            }
          })
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
              type: 0,
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