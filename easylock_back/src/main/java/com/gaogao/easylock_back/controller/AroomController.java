package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.mapper.AroomMapper;
import com.gaogao.easylock_back.service.AroomService;
import com.gaogao.easylock_back.service.FangyuanService;
import com.gaogao.easylock_back.service.OrdersService;
import com.gaogao.easylock_back.service.UnlockrecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aroom")
public class AroomController {
    @Autowired
    private AroomMapper aroomMapper;
    @Autowired
    private AroomService aroomService;
    @Autowired
    private FangyuanService fangyuanService;
    @Autowired
    private UnlockrecordService unlockrecordService;

    @Autowired
    private OrdersService ordersService;
    @PostMapping("/addroom")
    public Result<?> addroom(@RequestBody Aroom aroom){
        //添加房间
        if(aroom.getFid()==null||aroom.getOid()==null){
            return Result.success("0","缺乏关键信息，添加失败！");
        }
        if(!fangyuanService.isExist(aroom.getFid())){
            return Result.success("0","房源已删除，添加失败！");
        }
        if(aroomService.isExist(aroom)){
            return Result.success("0","房间号重复！");
        }
        Integer res=aroomService.save(aroom);
        if(res==0)
            return Result.success("0","添加失败！");
        return Result.success("1","添加成功！");
    }
    @PostMapping("/xiugai")
    public Result<?> xiugai(@RequestBody Aroom aroom){
        //修改房间信息
        if(aroomService.isExist2(aroom)){
            return Result.success("0","房间号重复！");
        }
        Integer res=aroomService.save(aroom);
        if(res==0)
            return Result.success("0","修改失败！");
        return Result.success("1","修改成功！");
    }
    @GetMapping("/findallroom/{oid}")
    public  Result<?> findallroom(@PathVariable Integer oid){
        List<Aroom> a=aroomMapper.findAllroom(oid);
        return Result.success(a,"查找成功！");
    }

    //找到房东用户的所有房间，内容简洁效率高
    @GetMapping("/getAllroom/{oid}")
    public  Result<?> getAllroom(@PathVariable Integer oid){
        List<Aroom> a=aroomMapper.getAllroom(oid);
        //更新房间在住状态
        for(Aroom t:a){
            if(ordersService.getroomstate(t.getRid())&&t.getState()==0){
                t.setState(1);
                aroomService.save(t);
            }
            else if(!ordersService.getroomstate(t.getRid())&&t.getState()==1){
                t.setState(0);
                aroomService.save(t);
            }
        }
        return Result.success(a,"查找成功！");
    }
    //查找单个房间的信息
    @GetMapping("/getroom/{rid}")
    public  Result<?> getroombyid(@PathVariable Integer rid){
        Aroom a=aroomMapper.getroombyid(rid);
        if(a.getDeviceid()==null)
            return Result.error(a,"该房间未绑定");
        return Result.success(a,"该房间已绑定！");
    }
    @PostMapping("/bind")
    public Result<?> bind(@RequestBody Aroom aroom){
        //修改房间信息
        Integer res=aroomService.save(aroom);
        System.out.println(aroom);
        if(res==0)
            return Result.success("0","绑定失败！");
        return Result.success("1","绑定成功！");
    }
//    @GetMapping("/isbind/{rid}")
//    public  Result<?> isbind(@PathVariable Integer rid){
//        Aroom a=aroomMapper.getdeviceidByrid(rid);
//        if(a==null)
//            return Result.error("0","该房间未绑定");
//        return Result.success(a,"该房间已绑定！");
//    }
    @PostMapping("/unbind/{rid}")
    public  Result<?> unbind(@PathVariable Integer rid){
        Integer a=aroomMapper.unbind(rid);
        if(a==1)
            return Result.error("1","解绑成功");
        return Result.success(a,"解绑失败！");
    }
    @DeleteMapping("/deleteroom/{rid}")
    public Result<?> deleteroom(@PathVariable Integer rid){
        if(aroomService.isliving(rid)){
            return Result.error("0","有人在住，无法删除！");
        }
        else{
            Integer a=aroomMapper.deleteById(rid);
            unlockrecordService.deleterecord(rid);
            if(a==1)
                return Result.success("1","删除成功！");
            else
                return Result.error("0","删除失败！");
        }
    }
}
