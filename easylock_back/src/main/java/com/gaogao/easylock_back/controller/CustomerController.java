package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.mapper.CustomerMapper;
import com.gaogao.easylock_back.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    private CustomerMapper customerMapper;
    @Autowired
    private CustomerService customerService;
    @PostMapping("/register")
    public Result<?> register(@RequestBody Customer customer){
        //注册
        if (customerService.isExist(customer)){
            return Result.error("0","用户名已存在！");
        }
        Customer res=customerMapper.selectOneByphone(customer.getPhone());
        if (res!=null){
            return Result.error("0","该手机号已注册！");
        }
        customerService.save(customer);
        return Result.success("1","注册成功！");
    }

    @PostMapping("/login")
    public Result<?> login(@RequestBody Customer customer){
        //登陆
        if (customerService.isExist(customer)){
            Customer res = customerMapper.selectOnetoLogin(customer.getUsername(),customer.getPasswd());
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
    public Integer xiugai(@RequestBody Customer customer){
        //修改信息，cid字段需要有值
        if(customer.getCid()==null)
            return 0;
        return customerService.save(customer);
    }
    //删除用户，路径里的cid就是参数的cid
    @DeleteMapping("/delete/{cid}")
    public Integer delete(@PathVariable Integer cid){
        return customerMapper.deleteById(cid);
    }
}
