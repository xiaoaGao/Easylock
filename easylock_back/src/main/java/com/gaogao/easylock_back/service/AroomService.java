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
        //添加房间时判断房间名是否存在
        Aroom res = aroomMapper.isexist(aroom.getRoomnum(),aroom.getFid());
        if (res==null){
            return false;
        }
        return true;
    }
    public boolean isExist2(@RequestBody Aroom aroom){
        //修改房间信息时判断用户名是否存在
        Aroom res = aroomMapper.isexist2(aroom.getRoomnum(),aroom.getFid(),aroom.getRid());
        if (res==null){
            return false;
        }
        return true;
    }
    public boolean isliving(Integer rid){
        //判断是否有人在住
        Aroom res = aroomMapper.isliving(rid);
        if (res.getState()==0){
            return false;
        }
        return true;
    }
    public Aroom selectByrid(Integer rid){
        //用rid找到房间
        return aroomMapper.getroombyid(rid);
    }
    //判断房间是否还在，防止已经被删除
    public Boolean isExist(Integer rid){
        if(aroomMapper.getroombyid(rid)==null){
            return false;
        }
        return true;
    }

}
