package com.gaogao.easylock_back.controller;

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
    public Integer register(@RequestBody Customer customer){
        //注册
        return customerService.save(customer);
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
