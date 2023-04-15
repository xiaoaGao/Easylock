package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.mapper.AroomMapper;
import com.gaogao.easylock_back.service.AroomService;
import com.gaogao.easylock_back.service.FangyuanService;
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
        return Result.success(a,"查找成功！");
    }
    @DeleteMapping("/delete/{rid}")
    public Integer delete(@PathVariable Integer rid){
        return aroomMapper.deleteById(rid);
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
}
