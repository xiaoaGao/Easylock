package com.gaogao.easylock_back.service;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.mapper.CustomerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class CustomerService {
    @Autowired
    private CustomerMapper customerMapper;

    //插入或修改
    public int save(Customer customer){
        if(customer.getCid()==null){
            return customerMapper.insert(customer);
        }
        else{
            return customerMapper.update(customer);
        }
    }
    public boolean isExist(@RequestBody Customer customer){
        //判断用户名是否存在
        Customer res = customerMapper.selectOneByusername(customer.getUsername());
        if (res==null){
            return false;
        }
        return true;
    }

}
