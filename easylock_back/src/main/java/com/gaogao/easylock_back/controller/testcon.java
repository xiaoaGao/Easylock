package com.gaogao.easylock_back.controller;

import com.alibaba.fastjson.JSONObject;
import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.mapper.CustomerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class testcon {
    @Autowired
    private CustomerMapper customerMapper;

    @GetMapping("/get")
    public  String func(){
        Customer c=new Customer();
        c.getCid();
        return "aaa";
    }
    @GetMapping("/w")
    public List<Customer> a(){

        return customerMapper.findAll();
    }
    @PostMapping("/post")
    public int po(@RequestBody JSONObject req){
        int a=req.getInteger("num1");
        int b=req.getInteger("num2");
        return a+b;
    }
}
