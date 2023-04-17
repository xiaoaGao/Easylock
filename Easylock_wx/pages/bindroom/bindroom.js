import Toast from '@vant/weapp/toast/toast';

//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    'deviceId': '',
    'serviceId': '',
    'characteristicId': '',
    'locks': [
      // {deviceId: '11',RSSI: -55}
    ],
    loadshow: true,
    rid: '',
    roomnum: '',
    startbind: false //为true时可以进行绑定操作
  },

  onLoad: function (options) {
    //  console.log(options)
    var that = this;
    that.setData({
      rid: options.rid,
      roomnum: options.roomnum
    })
    that.forbind();
  },
onUnload(){
//断开蓝牙连接
wx.closeBLEConnection(that.data.deviceId)
//关闭蓝牙适配器
wx.closeBluetoothAdapter()
},
  forbind() {
    //绑定界面使用
    var that = this;
    wx.onBluetoothDeviceFound((res) => {
      var ls = []
      res.devices.forEach((device) => {
        // 这里可以做一些过滤
        console.log('Device Found', device)
        if (device.name === "EASYLOCK"||device.localName === "EASYLOCK") {
          // 找到设备开始连接
          console.log(device.deviceId)
          // this.bleConnection(device.deviceId);
          ls = that.data.locks
          ls.push({
            deviceId: device.deviceId,
            RSSI: device.RSSI
          })
          that.setData({
            locks: ls
          })
          // console.log(that.data.locks)
          // wx.stopBluetoothDevicesDiscovery()
        }
      })
      // 找到要搜索的设备后，及时停止扫描
      // 
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
      console.log('onBLECharacteristicValueChange', result.value)
      let hex = that.ab2hex(result.value)
      console.log('hextoString', that.hextoString(hex))
      console.log('hex', hex)
    })
  },

  //点击绑定
  bind(e) {
    var that = this;
    let deviceid = e.currentTarget.dataset.deviceid
    console.log(deviceid)
    //关闭搜索图标
    that.setData({
      loadshow: false
    })
    Toast.loading({
      message: '绑定中...',
      forbidClick: true,
      duration: 0, //持续时间。0表示不会消失
    });
    this.bleConnection(deviceid);
    wx.stopBluetoothDevicesDiscovery()

    setTimeout(function () {
      //绑定门锁协议，传入房间号
      var msg = 'bd' + that.data.roomnum
      var buffer = that.stringToBytes(msg)
      wx.writeBLECharacteristicValue({
        deviceId: that.data.deviceId,
        serviceId: that.data.serviceId,
        characteristicId: that.data.characteristicId,
        value: buffer,
      })
      console.log("绑定成功")
      wx.request({
        url: backurl + '/aroom/bind',
        method: 'POST',
        data: {
          rid: that.data.rid,
          deviceid: deviceid
        },
        success(res) {
          console.log(res);
          if (res.data.code == 1) {
            //断开蓝牙连接
            wx.closeBLEConnection(that.data.deviceId)
            //关闭蓝牙适配器
            wx.closeBluetoothAdapter()
            // wx.navigateBack() //返回上一层
            const pages = getCurrentPages();
            // const currPage = pages[pages.length - 1]; //当前页面
            const prePage = pages[pages.length - 2]; //上一个页面 
            /**
             * 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
             * 不需要页面更新
             */
            console.log(pages)
            prePage.setData({
              type: 1
            })
            wx.navigateBack() //返回上一层
          } else {
            console.log("传送后端失败")
          }
        }
      })
    }, 7000)


    // that.bleConnection(deviceid);
    // wx.stopBluetoothDevicesDiscovery(); //停止搜索
    // console.log("绑定成功")
    // //给锁发送绑定请求
    // var buffer = this.stringToBytes("bd" + that.data.roomnum)
    // wx.writeBLECharacteristicValue({
    //   deviceId: this.data.deviceId,
    //   serviceId: this.data.serviceId,
    //   characteristicId: this.data.characteristicId,
    //   value: buffer,
    // }
    // )
    // //等待一秒后关闭蓝牙连接释放资源
    // setTimeout(function () {

    //   //断开蓝牙连接
    //   wx.closeBLEConnection(that.data.roomnum)
    //   //关闭蓝牙适配器
    //   wx.closeBluetoothAdapter()
    // }, 1000)
    // wx.request({
    //   url: backurl+'/aroom/bind',
    //   method: 'POST',
    //   data: {
    //     rid:that.data.rid,
    //     deviceid: deviceid
    //   },
    //   success(res) {
    //     console.log(res);
    //     if (res.data.code == 1) {
    //       wx.navigateBack()//返回上一层

    //     } else {
    //       console.log("传送后端失败")
    //     }
    //   }
    // })
  },
  bleConnection(deviceId) {
    wx.createBLEConnection({
      deviceId, // 搜索到设备的 deviceId
      success: () => {
        // 连接成功，获取服务
        console.log('连接成功，获取服务')
        this.bleGetDeviceServices(deviceId)
      }
    })
  },
  bleGetDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId, // 搜索到设备的 deviceId
      success: (res) => {
        console.log(res.services)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            // 可根据具体业务需要，选择一个主服务进行通信
            this.bleGetDeviceCharacteristics(deviceId, res.services[i].uuid)
          }
        }
      }
    })
  },
  bleGetDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId, // 搜索到设备的 deviceId
      serviceId, // 上一步中找到的某个服务
      success: (res) => {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          console.log(item)
          if (item.properties.write) { // 该特征值可写
            // 本示例是向蓝牙设备发送一个 0x00 的 16 进制数据
            // 实际使用时，应根据具体设备协议发送数据
            // let buffer = new ArrayBuffer(1)
            // let dataView = new DataView(buffer)
            // dataView.setUint8(0, 0)
            // let senddata = 'FF';
            // let buffer = this.hexString2ArrayBuffer(senddata);
            var buffer = this.stringToBytes("getid")
            this.setData({
              'deviceId': deviceId,
              'serviceId': serviceId,
              'characteristicId': item.uuid
            })
            wx.writeBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              value: buffer,
            })
          }
          if (item.properties.read) { // 改特征值可读
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.notify || item.properties.indicate) {
            // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
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