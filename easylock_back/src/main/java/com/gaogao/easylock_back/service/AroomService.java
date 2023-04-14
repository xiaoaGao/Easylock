package com.gaogao.easylock_back.service;

import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Fangyuan;
import com.gaogao.easylock_back.mapper.AroomMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class AroomService {
    @Autowired
    private AroomMapper aroomMapper;

    //插入或修改
    public int save(Aroom aroom){
        if(aroom.getRid()==null){
            return aroomMapper.insert(aroom);
        }
        else{
            return aroomMapper.update(aroom);
        }
    }
    public boolean isExist(@RequestBody Aroom aroom){
        //判断用户名是否存在
        Aroom res = aroomMapper.isexist(aroom.getRoomnum(),aroom.getFid());
        if (res==null){
            return false;
        }
        return true;
    }

}
