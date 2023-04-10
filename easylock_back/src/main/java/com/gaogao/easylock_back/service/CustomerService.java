package com.gaogao.easylock_back.service;

import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.mapper.CustomerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
