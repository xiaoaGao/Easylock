package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Demand;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DemandMapper {

    @Select("SELECT * FROM unlockrecord")
    List<Demand> findAll();


}
