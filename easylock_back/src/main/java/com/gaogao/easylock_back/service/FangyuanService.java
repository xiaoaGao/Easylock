package com.gaogao.easylock_back.service;

import com.gaogao.easylock_back.entity.Fangyuan;
import com.gaogao.easylock_back.entity.Owner;
import com.gaogao.easylock_back.mapper.FangyuanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class FangyuanService {
    @Autowired
    private FangyuanMapper fangyuanMapper;

    //插入或修改
    public int save(Fangyuan fangyuan){
        if(fangyuan.getFid()==null){
            return fangyuanMapper.insert(fangyuan);
        }
        else{
            return fangyuanMapper.update(fangyuan);
        }
    }
    public boolean isExist(@RequestBody Fangyuan fangyuan){
        //判断用户名是否存在
        Fangyuan res = fangyuanMapper.selectOneByfid(fangyuan.getFid());
        if (res==null){
            return false;
        }
        return true;
    }
    public boolean isExist(Integer fid){
        //判断用户名是否存在
        Fangyuan res = fangyuanMapper.selectOneByfid(fid);
        if (res==null){
            return false;
        }
        return true;
    }

}
