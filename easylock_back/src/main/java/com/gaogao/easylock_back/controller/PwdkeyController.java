package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.entity.Pwdkey;
import com.gaogao.easylock_back.mapper.PwdkeyMapper;
import com.gaogao.easylock_back.service.AroomService;
import com.gaogao.easylock_back.service.PwdkeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/pwdkey")
public class PwdkeyController {
    @Autowired
    private PwdkeyMapper pwdkeyMapper;
    @Autowired
    private PwdkeyService pwdkeyService;
    @Autowired
    private AroomService aroomService;
    @PostMapping("/newpwdkey")
    public Result<?> newpwdkey(@RequestBody Pwdkey pwdkey){
        Pwdkey res=pwdkeyService.setPwdkey(pwdkey);
        if(res==null)
            return Result.error("0","此时间段内已分配了时间段钥匙，发布失败！");
        return Result.success(res,res.getPassword());//返回随机密码
    }
    @PostMapping("/pwdunlock")
    public Result<?> pwdunlock(@RequestBody Pwdkey pwdkey){
        int res=pwdkeyService.unlock(pwdkey);
        int rid=pwdkeyService.getrid(pwdkey);
        if (res==0){
            // 开锁成功,返回允许开锁指令，锁开以后，前端在此发送开锁记录unlockrecord

            Aroom aroom= aroomService.findbyrid(rid);
            return Result.success(aroom, "允许开锁！");
        }
        if(res==1)
            return Result.error("0","房间有人在住，无法开门");
        if(res==2)
            return Result.error("0","密码错误！");
        if(res==3)
            return Result.error("0","该密码次数耗尽！");
        else
            return Result.error("0","不在该密码有效时间内！");
    }
    @GetMapping("/getroomkey/{rid}")
    public Result<?> getroomkey(@PathVariable Integer rid){
        //获取房间现在有效的房间密码钥匙
//        先删除已经失效的密码
        pwdkeyMapper.deleteDead();
        List<Pwdkey> res=pwdkeyMapper.getroomkeys(rid);

        return Result.success(res,"查找成功");
    }
    @DeleteMapping("/deletebypid/{pid}")
    public Result<?> deletebypid(@PathVariable Integer pid){
        //通过pid删除密码钥匙
        int res=pwdkeyMapper.deleteBypid(pid);
        if(res==0)
            return Result.error("0","删除失败");
        return Result.success("1","删除成功");
    }
}
