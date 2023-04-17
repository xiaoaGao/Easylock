import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
const backurl = app.globalData.backurl;

Page({

  data: {
    roomnum: '',
    rid: '',
    type:0,
    deviceId:'',
    isbind:true,
    bletype:0,
    standard:'',
    jieshao:''
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
    var that=this
    that.flash()
    if(that.data.type==1){
      //从绑定门锁中成功返回
      Toast('绑定成功！');
      that.data.type=0;
    }
    else if(that.data.type==2){
      //从绑定门锁中成功返回
      Toast('分发钥匙成功！');
      that.data.type=0;
    }
    
  },
  torecord(){
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
  deleteroom(){
    //删除房间
    var that=this
    if(that.data.isbind){
      Toast('请先解除绑定！')
    }
    else{
      Dialog.confirm({
        title: '提示',
        message: '删除操作不可恢复，确定删除这个房间吗？',
      })
        .then(() => {
          wx.request({
            url: backurl + '/aroom/deleteroom/'+that.data.rid,
            method: 'DELETE',
            success(res) {
              if (res.data.code == 1) {
                  wx.navigateBack()
              }
              else{
                Toast(res.data.msg)
              }
          }})
        })
        .catch(() => {
          
        });
    }
    
  },
  toeditroom(){
    //修改房间信息
    var that=this
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../editroom/editroom?rid='+that.data.rid+'&roomnum='+that.data.roomnum+'&standard='+that.data.standard+'&jieshao='+that.data.jieshao,
    })
  },
  unbind(){
    var that=this
    Dialog.confirm({
      title: '提示',
      message: '确定解除绑定且身处锁边吗？',
    })
      .then(() => {
        that.setData({
          bletype:1
        })//设置蓝牙操作为解绑
        wx.request({
          url: backurl + '/aroom/unbind/'+that.data.rid,
          method: 'POST',
          success(res) {
            if (res.data.code == 1) {
                that.setData({
                  deviceId:'',
                  isbind:false
                })
                Toast(res.data.msg)
            }
        }})
        that.bleInit()
        setTimeout(function () {
           //断开蓝牙连接
           wx.closeBLEConnection(that.data.deviceId)
           //关闭蓝牙适配器
           wx.closeBluetoothAdapter()
           Toast('解绑成功')
        }
        , 6000)
      })
      .catch(() => {
        
      });
    
  },
  unlock(){
    var that=this
    that.setData({
      bletype:2
    })//设置蓝牙操作为开门
    var me=wx.getStorageSync('me')
    wx.request({
      url: backurl + '/unlockrecord/unlock',
      method: 'POST',
      data: {
        rid: that.data.rid,
        type:'你',
        username: me.realname,
        phone: me.phone
      }})
    that.bleInit()
    setTimeout(function () {
       //断开蓝牙连接
       wx.closeBLEConnection(that.data.deviceId)
       //关闭蓝牙适配器
       wx.closeBluetoothAdapter()
       Toast('门已开')
    }
    , 3000)
  },
  togivekey(){
    var that=this
    //分配钥匙
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../givekey/givekey?rid=' + that.data.rid
    })
  },
  togiven(){
    var that=this
    //查看已发钥匙
    wx.navigateTo({
      //带参数跳转到其他页面
      url: '../given/given?rid=' + that.data.rid
    })
  },
  //刷新页面
  flash(){
    var that=this
    //  console.log(options)
    wx.request({
      url: backurl + '/aroom/getroom/'+that.data.rid,
      method: 'GET',
      success(res) {
        if (res.data.code == 1) {
            that.setData({
              deviceId:res.data.data.deviceid,
              standard:res.data.data.standard,
              roomnum:res.data.data.roomnum,
              jieshao:res.data.data.jieshao,
              isbind:true
            })
        } else {
          that.setData({
            standard:res.data.data.standard,
            roomnum:res.data.data.roomnum,
            jieshao:res.data.data.jieshao,
            isbind:false
          })
        }
    }})
  },

  //蓝牙BLE模块
  bleInit() {
    console.log('searchBle')
    var that= this
    // 监听扫描到新设备事件
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach((device) => {
        // 这里可以做一些过滤
        console.log('Device Found', device)
       
        if(device.deviceId == that.data.deviceId){
          // 找到设备开始连接
          this.bleConnection(device.deviceId);
          wx.stopBluetoothDevicesDiscovery()
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
    var that = this
    wx.onBLECharacteristicValueChange((result) => {
      console.log('onBLECharacteristicValueChange',result.value)
      let hex = that.ab2hex(result.value)
      console.log('hextoString',that.hextoString(hex))
      console.log('hex',hex)
    })
  },
  bleConnection(deviceId){
    wx.createBLEConnection({
      deviceId, // 搜索到设备的 deviceId
      success: () => {
        // 连接成功，获取服务
        console.log('连接成功，获取服务')
        this.bleGetDeviceServices(deviceId)
      }
    })
  },
  bleGetDeviceServices(deviceId){
    wx.getBLEDeviceServices({
      deviceId, // 搜索到设备的 deviceId
      success: (res) => {
        console.log(res.services)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            // 可根据具体业务需要，选择一个主服务进行通信
            this.bleGetDeviceCharacteristics(deviceId,res.services[i].uuid)
          }
        }
      }
    })
  },
  bleGetDeviceCharacteristics(deviceId,serviceId){
    var that=this
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
            //判断是什么类型的蓝牙操作
            if(that.data.bletype==1){
              //解除绑定
              var buffer = this.stringToBytes("ub")//解除绑定
              that.setData({
                bletype:0
              })
            }
            else if(that.data.bletype==2){
              //开门
              var buffer = this.stringToBytes("ulk")//解除绑定
              that.setData({
                bletype:0
              })
            }
            this.setData({
              'deviceId':deviceId,
              'serviceId':serviceId,
              'characteristicId':item.uuid
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