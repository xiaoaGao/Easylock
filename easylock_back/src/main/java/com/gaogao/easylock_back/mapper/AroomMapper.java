package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Fangyuan;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AroomMapper {

    @Select("SELECT * FROM aroom")
    List<Aroom> findAll();

    @Insert("insert into aroom(oid,roomnum,standard,jieshao,fid,state) " +
            "values (#{oid},#{roomnum},#{standard},#{jieshao},#{fid},0)")
    int insert(Aroom aroom);

    int update(Aroom aroom);

    @Delete("delete from aroom where rid=#{rid}")
    Integer deleteById(@Param("rid") Integer rid);

    @Select("SELECT * FROM aroom where oid=#{oid}")
    List<Aroom> findAllroom(@Param("oid") Integer oid);

    @Select("SELECT * FROM aroom where rid=#{rid}")
    Aroom getroombyid(@Param("rid") Integer rid);

    @Select("SELECT rid FROM aroom where roomnum=#{roomnum} and fid=#{fid}")
    Aroom isexist(@Param("roomnum") String roomnum,@Param("fid") Integer fid);


    @Select("SELECT * FROM aroom where roomnum=#{roomnum} and fid=#{fid} and rid != #{rid}")
    Aroom isexist2(@Param("roomnum") String roomnum,@Param("fid") Integer fid,@Param("rid") Integer rid);

    @Select("SELECT deviceid FROM aroom where rid=#{rid}")
    Aroom getdeviceidByrid(@Param("rid") Integer rid);

    //找到房东用户的所有房间，内容简洁效率高
    @Select("SELECT rid,roomnum,state,fid FROM aroom where oid=#{oid}")
    List<Aroom> getAllroom(@Param("oid") Integer oid);

    @Update("update aroom set deviceid = null where rid=#{rid} ;")
    Integer unbind(@Param("rid") Integer rid);

    @Select("SELECT state FROM aroom where rid=#{rid}")
    Aroom isliving(@Param("rid") Integer rid);
}
