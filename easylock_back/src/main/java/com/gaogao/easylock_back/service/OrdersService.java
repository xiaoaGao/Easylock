package com.gaogao.easylock_back.service;


import com.gaogao.easylock_back.controller.givenorder;
import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Fangyuan;
import com.gaogao.easylock_back.entity.Orders;
import com.gaogao.easylock_back.entity.roomporder;
import com.gaogao.easylock_back.mapper.OrdersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrdersService {
    @Autowired
    private OrdersMapper ordersMapper;
    @Autowired
    private AroomService aroomService;
    @Autowired
    private FangyuanService fangyuanService;
//    //插入或修改
    public Integer save(Orders orders){
        if(orders.getOrdid()==null){
            return ordersMapper.insert(orders);
        }
        else{
            return ordersMapper.update(orders);
        }
    }
    //判断传入的时间是否合法，若与已存在的房间时间冲突则非法
    public boolean islegal(givenorder given){
        //找到所有rid房间正在进行的订单
        List<Orders> os=ordersMapper.findallunfinish(given.getRid());
        for(Orders o:os){
            if(daycontain(given.getStart(),o.getStart(),o.getEnd()))
                return false;
            if(daycontain(given.getEnd(),o.getStart(),o.getEnd()))
                return false;
        }
        return true;
    }

    //通过ordid获取order
    public Orders getorderByid(Integer ordid){
        //找到所有rid房间正在进行的订单
        Orders os=ordersMapper.getorderByid(ordid);
        return os;
    }
    public boolean daycontain(Date d,Date d1,Date d2){
        //判断d是否在d1,d2时间段内
        if(d.getTime()>=d1.getTime()&&d.getTime()<=d2.getTime())
//            System.out.println("在这段时间内");
            return true;
        else
            return false;
    }

    public boolean getroomstate(Integer rid){
        //判断此时房间是否在住,若有人在住返回true
        List<Orders> os=ordersMapper.findallunfinish(rid);
        Date now=new Date();
        for(Orders o:os){
            if(daycontain(now,o.getStart(),o.getEnd()))
                return true;
        }
        return false;
    }

    public List<roomporder> getmyroom(String phone){
        //通过手机号查找未过期的订单,没有则返回null
        List<Orders> os=ordersMapper.findallunfinishByphone(phone);
        Date now=new Date();
        List<roomporder> list = new ArrayList();
        for(Orders o:os){
            if(!aroomService.isExist(o.getRid())){
                //房间已经不存在了
                continue;
            }
            if(daycontain(now,o.getStart(),o.getEnd())) {
                //这个房间已经就绪
                roomporder r=new roomporder();
                r.setOrders(o);
                Aroom a=aroomService.selectByrid(o.getRid());
                r.setAroom(a);
                Fangyuan f=fangyuanService.selectByfid(a.getFid());
                r.setFangyuan(f);
                r.setReady(1);
                list.add(r);
            }
            else {
                //这个房间还无法入住
                roomporder r=new roomporder();
                r.setOrders(o);
                Aroom a=aroomService.selectByrid(o.getRid());
                r.setAroom(a);
                Fangyuan f=fangyuanService.selectByfid(a.getFid());
                r.setFangyuan(f);
                r.setReady(0);
                list.add(r);
            }
        }
        if(list.size()>0)
            return list;
        return null;
    }

//    public List<roomporder> getmyroom2(String phone,String realname,String idnum){
//        //通过手机号查找未过期的订单,没有则返回null
//        List<Orders> os=ordersMapper.findallunfinish(phone,realname,idnum);
//        Date now=new Date();
//        List<roomporder> list = new ArrayList();
//        for(Orders o:os){
//            if(daycontain(now,o.getStart(),o.getEnd())) {
//                //这个房间已经就绪
//                roomporder r=new roomporder();
//                r.setOrders(o);
//                Aroom a=aroomService.selectByrid(o.getRid());
//                r.setAroom(a);
//                Fangyuan f=fangyuanService.selectByfid(a.getFid());
//                r.setFangyuan(f);
//                r.setReady(1);
//                list.add(r);
//            }
//            else {
//                //这个房间还无法入住
//                roomporder r=new roomporder();
//                r.setOrders(o);
//                Aroom a=aroomService.selectByrid(o.getRid());
//                r.setAroom(a);
//                Fangyuan f=fangyuanService.selectByfid(a.getFid());
//                r.setFangyuan(f);
//                r.setReady(0);
//                list.add(r);
//            }
//        }
//        if(list.size()>0)
//            return list;
//        return null;
//    }

}
