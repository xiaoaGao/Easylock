package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Fangyuan;
import com.gaogao.easylock_back.mapper.FangyuanMapper;
import com.gaogao.easylock_back.service.FangyuanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fangyuan")
public class FangyuanController {
    @Autowired
    private FangyuanMapper fangyuanMapper;
    @Autowired
    private FangyuanService fangyuanService;

    @PostMapping("/addfang")
    public Result<?> addfang(@RequestBody Fangyuan fangyuan){
        //添加房间
        if(fangyuan.getOid()==null){
            return Result.success("0","添加失败！");
        }
        Integer res=fangyuanService.save(fangyuan);
        if(res==0)
            return Result.success("0","添加失败！");
        return Result.success("1","添加成功！");
    }
    @PostMapping("/xiugai")
    public Result<?> xiugai(@RequestBody Fangyuan fangyuan){
        //修改房间信息
        Integer res=fangyuanService.save(fangyuan);
        if(res==0)
            return Result.success("0","修改失败！");
        return Result.success("1","修改成功！");
    }
    @GetMapping("/findallfang/{oid}")
    public  Result<?> findallfang(@PathVariable Integer oid){
        List<Fangyuan> a=fangyuanMapper.findAllfang(oid);
        return Result.success(a,"查找成功！");
    }
    @DeleteMapping("/delete/{fid}")
    public Integer delete(@PathVariable Integer fid){
        return fangyuanMapper.deleteById(fid);
    }

}
