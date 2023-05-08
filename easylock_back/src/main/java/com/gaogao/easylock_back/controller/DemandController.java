package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Demand;
import com.gaogao.easylock_back.entity.Orders;
import com.gaogao.easylock_back.entity.Unlockrecord;
import com.gaogao.easylock_back.mapper.DemandMapper;
import com.gaogao.easylock_back.service.DemandService;
import com.gaogao.easylock_back.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/demand")
public class DemandController {
    @Autowired
    private DemandMapper demandMapper;
    @Autowired
    private DemandService demandService;
    @Autowired
    private OrdersService ordersService;

    @GetMapping("/getdemands/{oid}")
    public Result<?> getrecords(@PathVariable Integer oid) {
        List<Demand> res = demandService.getdemandsByoid(oid);
        if (res == null)
            return Result.error("0", "没有找到现有需求");
        return Result.success(res, "查找成功！");
    }
    @GetMapping("/getroomdemand/{rid}")
    public Result<?> getroomdemand(@PathVariable Integer rid) {
        List<Demand> res = demandService.getdemandsByrid(rid);
        if (res == null)
            return Result.error("0", "没有找到现有需求");
        return Result.success(res, "查找成功！");
    }
    @GetMapping("/custgetdemand/{ordid}")
    public Result<?> custgetdemand(@PathVariable Integer ordid) {
        //房客获取此次订单的请求
        List<Demand> res = demandService.getdemandsByordid(ordid);
        if (res == null)
            return Result.error("0", "您还没有请求");
        return Result.success(res, "查找成功！");
    }
    @PostMapping("/prolongdemand")
    public Result<?> prolongdemand(@RequestBody Demand demand) {
        //延长入住天数的请求
        Date date = new Date();
//        SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        System.out.println(sdf.format(day));
        Orders o = ordersService.getorderByid(demand.getOrdid());
        if (o == null)
            return Result.error("0", "参数错误！");
//        long i = demand.getNote();
        //判断请求延长的日期是否合法，若不合法则不允许
        givenorder g = new givenorder();
        g.setRid(o.getRid());
        date = o.getEnd();
        long endtime = date.getTime();
        Date newdate = date;
        newdate.setTime(endtime + 1000);//结束时间加1秒，防止服务查到自己这个订单
        g.setStart(newdate);
        for(int i=1;i<=demand.getNote();i++){
            newdate.setTime(endtime + i * 60 * 60 * 24*1000);//结束时间加i天，看延长了i天是否合法
            g.setEnd(newdate);
            if (!ordersService.islegal(g)) {
                return Result.error("0", "该期限内房间已经无法提供给您！");
            }
        }

        int res = demandService.save(demand);
        if (res == 0)
            return Result.success("0", "请求失败！");
        return Result.success("1", "请求成功！");
    }
    @PostMapping("/otherdemand")
    public Result<?> otherdemand(@RequestBody Demand demand) {
        //其他请求，如请求更换床单，打扫卫生等等
        int res = demandService.save(demand);
        if (res == 0)
            return Result.success("0", "请求失败！");
        return Result.success("1", "请求成功！");
    }
    @PostMapping("/dodemand")
    public Result<?> dodemand(@RequestBody Demand demand) {
        //其他请求，如请求更换床单，打扫卫生等等
        demand=demandService.getBydid(demand.getDid());
        if(demand.getDtype()==1){
            //是延长入住天数的请求，此接口为同意分配
            Date date = new Date();

            if(demand==null)
                return Result.error("0","请求不存在");
            Orders o = ordersService.getorderByid(demand.getOrdid());
            if (o == null)
                return Result.error("0", "参数错误！");
//            int i = demand.getNote();
            //判断请求延长的日期是否合法，若不合法则不允许
            givenorder g = new givenorder();
            g.setRid(o.getRid());
            date = o.getEnd();
            long endtime = date.getTime();
            Date newdate = date;
            newdate.setTime(endtime + 1000);//结束时间加1秒，防止服务查到自己这个订单
            g.setStart(newdate);
            for(int i=1;i<=demand.getNote();i++){
                newdate.setTime(endtime + i * 60 * 60 * 24*1000);//结束时间加i天，看延长了i天是否合法
                g.setEnd(newdate);
                if (!ordersService.islegal(g)) {
                    return Result.error("0", "该段时间的钥匙已被分配，请拒绝该请求或删除已分配的钥匙！");
                }
            }
            demand.setDone(1);//设置完成
            int res = demandService.save(demand);
            Orders orders=new Orders();
            orders.setOrdid(demand.getOrdid());
            orders.setEnd(newdate);//把加了几天的日期传给orders
            int res2 = ordersService.save(orders);
            if(res==1&&res2==1)
                return Result.success("1","处理续住成功！");
            return Result.error("0","处理失败！");
        }
        else {
            demand.setDone(1);//设置完成
            int res = demandService.save(demand);
            if (res == 0)
                return Result.success("0", "确认失败！");
            return Result.success("1", "确认成功！");
        }
    }
    @PostMapping("/rejectprolong")  
    public Result<?> rejectprolong(@RequestBody Demand demand) {
        //房东拒绝续住的请求
        if(demand.getDtype()!=1)
            return  Result.error("0","参数错误！");
        demand.setDone(2);//2代表拒绝请求
        int res=demandService.save(demand);
        if(res==1){
            return Result.success("1","成功拒绝！");
        }
        return Result.error("0","拒绝失败！");
    }

}
