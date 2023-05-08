package com.gaogao.easylock_back.service;

import com.gaogao.easylock_back.common.BCrypt;
import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.entity.Owner;
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
        String gensalt= BCrypt.gensalt();//29个字符 创建随机盐
        //使用随机生成的盐对密码进行加密
        String newpwd=BCrypt.hashpw(customer.getPasswd(),gensalt);
        customer.setPasswd(newpwd);
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
    public Customer getByusername(@RequestBody Customer customer){
        //判断用户名是否存在，
        Customer res = customerMapper.selectOneByusername(customer.getUsername());
        return res;
    }
}
