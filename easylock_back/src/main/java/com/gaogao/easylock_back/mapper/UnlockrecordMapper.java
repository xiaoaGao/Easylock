package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Unlockrecord;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UnlockrecordMapper {

    @Select("SELECT * FROM unlockrecord")
    List<Unlockrecord> findAll();

    @Insert("insert into unlockrecord(rid,time,type,realname,phone) " +
            "values (#{rid},#{time},#{type},#{realname},#{phone})")
    int insert(Unlockrecord unlockrecord);

    @Delete("delete from unlockrecord where rid=#{rid}")
    Integer deleteById(@Param("rid") Integer rid);

    @Select("SELECT * FROM unlockrecord where rid=#{rid}")
    List<Unlockrecord> getrecords(@Param("rid") Integer rid);


}
