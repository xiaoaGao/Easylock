package com.gaogao.easylock_back.service;


import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Unlockrecord;
import com.gaogao.easylock_back.mapper.UnlockrecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Date;

@Service
public class UnlockrecordService {
    @Autowired
    private UnlockrecordMapper unlockrecordMapper;

    public Integer deleterecord(@RequestBody Integer rid){

        return unlockrecordMapper.deleteById(rid);
    }
    public boolean insertunlock(Unlockrecord unlockrecord){
        //开锁记录保存
        Date day=new Date();
        unlockrecord.setTime(day);
        Integer res=unlockrecordMapper.insert(unlockrecord);
        if(res==0)
            return false;
        return true;
    }


}
