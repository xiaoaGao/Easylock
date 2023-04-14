package com.gaogao.easylock_back.service;


import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.entity.Owner;
import com.gaogao.easylock_back.mapper.OwnerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class OwnerService {
    @Autowired
    private OwnerMapper ownerMapper;

    //插入或修改
    public int save(Owner owner){
        if(owner.getOid()==null){
            return ownerMapper.insert(owner);
        }
        else{
            return ownerMapper.update(owner);
        }
    }
    public boolean isExist(@RequestBody Owner owner){
        //判断用户名是否存在
        Owner res = ownerMapper.selectOneByusername(owner.getUsername());
        if (res==null){
            return false;
        }
        return true;
    }
}
