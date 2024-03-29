package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.BCrypt;
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
        //注册
        Owner res = ownerMapper.selectOneByusername(owner.getUsername());
        if (res!=null){
            return Result.error("0","用户名已存在！");
        }
        res=ownerMapper.selectOneByphone(owner.getPhone());
        if (res!=null){
            return Result.error("0","该手机号已注册！");
        }
        ownerService.save(owner);
        return Result.success("1","注册成功！");
    }
    @PostMapping("/login")
    public Result<?> login(@RequestBody Owner owner){
        //登陆
        Owner dbowner=ownerService.getByusername(owner);
        if (dbowner!=null){
//            Owner res = ownerMapper.selectOnetoLogin(owner.getUsername(),owner.getPasswd());
            if(!BCrypt.checkpw(owner.getPasswd(),dbowner.getPasswd())){
                return Result.error("0","用户名或密码错误！");
            }
            else{
                return Result.success(dbowner,"登陆成功！");
            }
        }
        else{
            return Result.error("0","用户名不存在！");
        }
    }
    @PostMapping("/xiugai")
    public Integer xiugai(@RequestBody Owner owner){
        //修改信息，oid字段需要有值
        if(owner.getOid()==null)
            return 0;
        return ownerService.save(owner);
    }
    @PostMapping("/changepwd")
    public Result<?> changepwd(@RequestParam Integer  oid,@RequestParam String  oldpwd,@RequestParam String  newpwd) {
        Owner dbowner=ownerMapper.selectOneByoid(oid);//根据id获取数据库中的信息

//        Owner res= ownerMapper.selectByIdAndPwd(oid,oldpwd);
        if(!BCrypt.checkpw(oldpwd,dbowner.getPasswd())){
            //原密码不正确
            return Result.error("0","原密码错误！");
        }
        else{

            dbowner.setPasswd(newpwd);
            if(ownerService.save(dbowner)==0){
                return Result.error("0","修改失败！");
            }
            else
                return Result.success("1","修改成功！");
        }
    }
    //删除用户，路径里的cid就是参数的oid
    @DeleteMapping("/delete/{oid}")
    public Integer delete(@PathVariable Integer oid){
        return ownerMapper.deleteById(oid);
    }
}