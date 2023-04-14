package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.entity.Owner;
import com.gaogao.easylock_back.mapper.OwnerMapper;
import com.gaogao.easylock_back.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
public class OwnerController {
    @Autowired
    private OwnerMapper ownerMapper;
    @Autowired
    private OwnerService ownerService;
    @PostMapping("/register")
    public Result<?> register(@RequestBody Owner owner){
        //注册F
        Owner res = ownerMapper.selectOneByusername(owner.getUsername());
        if (res!=null){
            return Result.error("-1","用户名已存在！");
        }
        ownerService.save(owner);
        return Result.success("1","注册成功！");
    }
    @PostMapping("/login")
    public Result<?> login(@RequestBody Owner owner){
        //登陆
        if (ownerService.isExist(owner)){
            Owner res = ownerMapper.selectOnetoLogin(owner.getUsername(),owner.getPasswd());
            if(res==null){
                return Result.error("-1","用户名或密码错误！");
            }
            else{
                return Result.success(res,"登陆成功！");
            }
        }
        else{
            return Result.error("-1","用户名不存在！");
        }
    }
    @PostMapping("/xiugai")
    public Integer xiugai(@RequestBody Owner owner){
        //修改信息，oid字段需要有值
        if(owner.getOid()==null)
            return 0;
        return ownerService.save(owner);
    }
    //删除用户，路径里的cid就是参数的oid
    @DeleteMapping("/delete/{oid}")
    public Integer delete(@PathVariable Integer oid){
        return ownerMapper.deleteById(oid);
    }
}