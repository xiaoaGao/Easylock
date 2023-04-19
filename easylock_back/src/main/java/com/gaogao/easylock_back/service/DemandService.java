package com.gaogao.easylock_back.service;


import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Demand;
import com.gaogao.easylock_back.entity.Fangyuan;
import com.gaogao.easylock_back.mapper.DemandMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class DemandService {
    @Autowired
    private DemandMapper demandMapper;

    public List<Demand> getdemandsByoid(Integer oid){
        List<Demand> res=demandMapper.findByoid(oid);
        if(res.size()==0)
            return null;
        return res;
    }
    public List<Demand> getdemandsByrid(Integer rid){
        List<Demand> res=demandMapper.findByrid(rid);
        if(res.size()==0)
            return null;
        return res;
    }
    public Demand getBydid(Integer did){
        Demand res=demandMapper.findBydid(did);
        return res;
    }
    public List<Demand> getdemandsByordid(Integer ordid){
        List<Demand> res=demandMapper.findByordid(ordid);
        if(res.size()==0)
            return null;
        return res;
    }
    //插入或修改
    public int save(Demand demand){
        if(demand.getDid()==null){
            return demandMapper.insert(demand);
        }
        else{
            return demandMapper.update(demand);
        }
    }


}
