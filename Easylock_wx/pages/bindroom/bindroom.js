import Toast from '@vant/weapp/toast/toast';

//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
const backurl = app.globalData.backurl;
const service_Id='6E400001-B5A3-F393-E0A9-E50E24DCCA9E';//服务UUID
const notify_Id='6E400003-B5A3-F393-E0A9-E50E24DCCA9E';//notify特征值UUID
const write_Id='6E400002-B5A3-F393-E0A9-E50E24DCCA9E';//write特征值UUID
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
    oid:'',
    dd:'',
    randomcode:''
  },

  onLoad: function (options) {
    //  console.log(options)
    var that = this;
    var me=wx.getStorageSync('me')
    that.setData({
      rid: options.rid,
      roomnum: options.roomnum,
      oid:me.oid
    })
    that.forbind();
  },
onUnload(){
//断开蓝牙连接
var that=this
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
      var that=this
      //特征值变化
      console.log('收到了：', result.value)
      let hex = that.ab2hex(result.value)
      console.log('转成字符：', that.hextoString(hex))
      let res = that.hextoString(hex)
      // console.log('长度'+res.length)
      // console.log('res[0]'+res[0])
      if(res.length==2){
        console.log('随机验证码：'+res)
        //收到了验证码
        that.setData({
          randomcode:res.slice(0,2)
        })
        //这时候再发绑定消息
        //绑定门锁协议，传入房间号
        var msg = that.data.randomcode+'bd' + that.data.oid
        var buffer = that.stringToBytes(msg)
        console.log('发送'+msg)
        wx.writeBLECharacteristicValue({
          deviceId: that.data.dd,
          serviceId: service_Id,
          characteristicId: write_Id,
          value: buffer,
        })
      }
      else{
        console.log('收到锁动作应答：'+res)
        if(res==='error1'){
          console.log('随机验证码错误')
          Toast('绑定失败！')
        }
        else if(res==='error2'){
          console.log('门锁已绑定')
          Toast('绑定失败！')
        }
        else if(res==='bdsuccess'){
          console.log('绑定成功')

          //这时候再请求后端
          wx.request({
            url: backurl + '/aroom/bind',
            method: 'POST',
            data: {
              rid: that.data.rid,
              deviceid: that.data.dd
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
                // console.log(pages)
                prePage.setData({
                  type: 1
                })
                that.setData({
                  locks:[]
                })
                wx.navigateBack() //返回上一层
              } else {
                console.log("传送后端失败")
              }
            }
          })
        }
      }
    })
  },

  //点击绑定
  bind(e) {
    var that = this;
    let deviceid = e.currentTarget.dataset.deviceid

    console.log(deviceid)
    //关闭搜索图标
    that.setData({
      loadshow: false,
      dd:deviceid
    })
    Toast.loading({
      message: '绑定中...',
      forbidClick: true,
      duration: 2, //持续时间。0表示不会消失
    });
    this.bleConnection(deviceid);
    wx.stopBluetoothDevicesDiscovery()

  },
  bleConnection(deviceId) {
    var that=this
    wx.createBLEConnection({
      deviceId, // 搜索到设备的 deviceId
      success: () => {
        // 连接成功
        console.log('连接成功')

        //连接成功后，监听订阅notify
        // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
        wx.notifyBLECharacteristicValueChange({
          deviceId,
          serviceId:service_Id,
          characteristicId:notify_Id,
          state: true,
        })
        console.log('订阅成功')
        setTimeout(function () {
          //订阅成功后，等待半秒开始通信,获取随机验证码
        var buffer = that.stringToBytes("getid")//字符串转字节
        wx.writeBLECharacteristicValue({
          deviceId,
          serviceId:service_Id,
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