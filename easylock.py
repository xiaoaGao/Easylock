from machine import Pin, PWM
from machine import Timer
import random
import time
import bluetooth

BLE_MSG = ""


class ESP32_BLE():
    def __init__(self, name):
        self.led = Pin(2, Pin.OUT)
        self.timer1 = Timer(0)
        self.name = name
        self.ble = bluetooth.BLE()
        self.ble.active(True)
        self.ble.config(gap_name=name)
        self.disconnected()
        self.ble.irq(self.ble_irq)
        self.register()
        self.advertiser()
        self.isbind=False
        self.oid=0#绑定后锁对应房主的oid
        
    #修改蓝牙名称
    def changename(self,name):
        self.name=name
        
    def connected(self):
        self.led.value(1)
        self.timer1.deinit()

    def disconnected(self):        
        self.timer1.init(period=100, mode=Timer.PERIODIC, callback=lambda t: self.led.value(not self.led.value()))

    def ble_irq(self, event, data):
        global BLE_MSG
        if event == 1: #_IRQ_CENTRAL_CONNECT 手机链接了此设备
            self.connected()
        elif event == 2: #_IRQ_CENTRAL_DISCONNECT 手机断开此设备
            self.advertiser()
            self.disconnected()
        elif event == 3: #_IRQ_GATTS_WRITE 手机发送了数据 
            buffer = self.ble.gatts_read(self.rx)
            BLE_MSG = buffer.decode('UTF-8').strip()
            
    def register(self):        
        service_uuid = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'
        reader_uuid = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'
        sender_uuid = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'
        services = (
            (
                bluetooth.UUID(service_uuid), 
                (
                    (bluetooth.UUID(sender_uuid), bluetooth.FLAG_NOTIFY), 
                    (bluetooth.UUID(reader_uuid), bluetooth.FLAG_WRITE),
                )
                
                
            ), 
        )

        ((self.tx, self.rx,), ) = self.ble.gatts_register_services(services)

    def send(self, data):
        self.ble.gatts_notify(0, self.tx, data)

    def advertiser(self):
        name = bytes(self.name, 'UTF-8')
        adv_data = bytearray('\x02\x01\x02') + bytearray((len(name) + 1, 0x09)) + name
        self.ble.gap_advertise(100, adv_data)
        print(adv_data)
        print("\r\n")


def buttons_irq(pin):
    ble.changename("EASYLOCK")
    ble.disconnected()
    ble.isbind=False
    ble.oid=0
    print(ble.isbind)
    print('初始化成功')
    p16.value(0)  # 响
    time.sleep(2)
    p16.value(1)  # 不响
    

if __name__ == "__main__":
    ble = ESP32_BLE("EASYLOCK")
    
    but = Pin(0, Pin.IN)
    but.irq(trigger=Pin.IRQ_FALLING, handler=buttons_irq)#初始化中断
    
    randomcode='00'#随机验证码
    
    
    p4 = PWM(Pin(4))#舵机
    p4.freq(50)
    
    p16 = Pin(16, Pin.OUT)#bee
    
    for i in range(3):
            p16.value(0)  # 响
            time.sleep(0.2)
            p16.value(1)  # 不响
            time.sleep(0.2)
    
    p4.duty_u16(1638)
    
    led = Pin(2, Pin.OUT)

    
    while True:
        if BLE_MSG == 'getid':
            print(BLE_MSG)
            BLE_MSG = ""
            randomcode=str(random.randint(10, 99))#生成两位数随机验证码
            print('随机验证码:'+randomcode)
            ble.send(randomcode)#发送随机验证码，之后通信需要
            tongxin=True#成功建立通信
            while tongxin:
                if (BLE_MSG[0:2] == randomcode):
                    if (BLE_MSG[2:5] == 'ulk'):#开锁
                        if (BLE_MSG[5:] == ble.oid):
                            print(BLE_MSG)
                            BLE_MSG = ""
                            p4.duty_u16(4915)
                            time.sleep(2)
                            p4.duty_u16(1638)
                            ble.send('ulksuccess')
                            tongxin=False#断开通信
                        else:
                            #开门人不对，报警
                            BLE_MSG = ""
                            p16.value(0)  # 响
                            time.sleep(3)
                            p16.value(1)  # 不响
                            tongxin=False#断开通信
                    elif (BLE_MSG[2:4] == 'bd' ):#绑定门锁
                        if not ble.isbind:
                            print(BLE_MSG)
                            ble.oid=BLE_MSG[4:]#绑定人身份
                            ble.isbind=True#设为绑定状态
                            ble.changename(ble.oid+'slock')
                            print('bind success!')
                            BLE_MSG = ""
                            for i in range(3):
                                p16.value(0)  # 响
                                time.sleep(0.2)
                                p16.value(1)  # 不响
                                time.sleep(0.2)
                            ble.send('bdsuccess')
                            tongxin=False#断开通信
                        else:
                            print('error2')#门锁已经绑定
                            BLE_MSG = ""
                            ble.send('error2')
                            tongxin=False#断开通信
                    elif (BLE_MSG[2:4] == 'ub'):#解除绑定
                        if (BLE_MSG[4:] == ble.oid):
                            print(BLE_MSG)
                            ble.changename("EASYLOCK")
                            ble.isbind=False
                            ble.oid=0
                            print('unbind!')
                            BLE_MSG = ""
                            for i in range(2):
                                p16.value(0)  # 响
                                time.sleep(1)
                                p16.value(1)  # 不响
                                time.sleep(1)
                            ble.send('ubdsuccess')
                            tongxin=False#断开通信
                        else:
                            #解绑人不对，报警
                            BLE_MSG = ""
                            p16.value(0)  # 响
                            time.sleep(3)
                            p16.value(1)  # 不响
                            tongxin=False#断开通信
                        
                    else:
                        print('error1')#收到的验证码不对
                        BLE_MSG = ""
                        ble.send('error1')
                        tongxin=False#断开通信
                    time.sleep(1)
        p16.value(1)  # 不响
        time.sleep(1)