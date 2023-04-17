package com.gaogao.easylock_back.service;


import com.gaogao.easylock_back.mapper.UnlockrecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class UnlockrecordService {
    @Autowired
    private UnlockrecordMapper unlockrecordMapper;

    public Integer deleterecord(@RequestBody Integer rid){

        return unlockrecordMapper.deleteById(rid);
    }


}
