package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Fangyuan;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FangyuanMapper {

    @Select("SELECT * FROM fangyuan")
    List<Fangyuan> findAll();

    @Insert("insert into fangyuan(oid,fname,location) " +
            "values (#{oid},#{fname},#{location})")
    int insert(Fangyuan fangyuan);

    int update(Fangyuan fangyuan);

    @Delete("delete from fangyuan where rid=#{fid}")
    Integer deleteById(@Param("fid") Integer fid);

    @Select("SELECT * FROM fangyuan where oid=#{oid}")
    List<Fangyuan> findAllfang(@Param("oid") Integer oid);

    @Select("SELECT * FROM fangyuan where fid=#{fid}")
    Fangyuan selectOneByfid(@Param("fid") Integer fid);


}
