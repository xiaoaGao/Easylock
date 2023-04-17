package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Unlockrecord;
import com.gaogao.easylock_back.mapper.UnlockrecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/unlockrecord")
public class UnlockrecordController {
    @Autowired
    private UnlockrecordMapper unlockrecordMapper;

    @PostMapping("/unlock")
    public Result<?> unlock(@RequestBody Unlockrecord unlockrecord){
        //开锁记录保存
        Date day=new Date();
//        SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        System.out.println(sdf.format(day));
        unlockrecord.setTime(day);
        System.out.println(unlockrecord.getTime());
        Integer res=unlockrecordMapper.insert(unlockrecord);
        if(res==0)
            return Result.success("0","添加失败！");
        return Result.success("1","添加成功！");
    }
    @GetMapping("/getrecords/{rid}")
    public  Result<?> getrecords(@PathVariable Integer rid){
        List<Unlockrecord> a=unlockrecordMapper.getrecords(rid);
        return Result.success(a,"查找成功！");
    }

}
