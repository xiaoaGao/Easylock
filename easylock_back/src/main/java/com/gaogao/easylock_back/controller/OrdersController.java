package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.entity.Orders;
import com.gaogao.easylock_back.mapper.OrdersMapper;
import com.gaogao.easylock_back.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    @Autowired
    private OrdersMapper ordersMapper;
    @Autowired
    private OrdersService ordersService;

    @PostMapping("/givekey")
    public Result<?> givekey(@RequestBody givenorder given){
        //订单创建时间
        Date day=new Date();
        Orders orders =new Orders();
        SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        System.out.println(given.getStart());
        if(!ordersService.islegal(given))
            return Result.success("0","选择的时间段内已有分配！");
        orders.setRid(given.getRid());
        orders.setOrdertime(day);
        orders.setStart(given.getStart());
        orders.setEnd(given.getEnd());
        for(Customer c:given.getCustomers()){
//            System.out.println(c.toString());
            orders.setRealname(c.getRealname());
            orders.setIdnum(c.getIdnum());
            orders.setPhone(c.getPhone());
            ordersMapper.insert(orders);
                    }
        return Result.success("1","分发钥匙成功！");
    }
    @GetMapping("/getgiven/{rid}")
    public  Result<?> getgiven(@PathVariable Integer rid){
        List<Orders> a=ordersMapper.findallunfinish(rid);
        return Result.success(a,"查找成功！");
    }
    @DeleteMapping("/deletegiven/{ordid}")
    public  Result<?> deletegiven(@PathVariable Integer ordid){
        Integer a=ordersMapper.deleteByOrdid(ordid);
        if(a==0)
            return Result.error("0","删除失败！");
        return Result.success(a,"删除成功！");
    }

    @GetMapping("/getroomstate/{rid}")
    public  Result<?> getroomstate(@PathVariable Integer rid){
        if(ordersService.getroomstate(rid))
            return Result.success("1","有人在住！");//有人在住就返回code=1
        else
            return Result.success("0","无人在住！");
    }
}
