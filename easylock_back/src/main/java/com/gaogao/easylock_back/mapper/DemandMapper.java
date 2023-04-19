package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Demand;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DemandMapper {

    @Select("SELECT a.oid,b.rid,c.ordid,c.realname,c.phone,d.did,d.dtype,d.note,d.done " +
            "FROM owner a " +
            "inner JOIN aroom b " +
            "on a.oid=b.oid " +
            "inner join orders c " +
            "on b.rid=c.rid " +
            "inner join demand d " +
            "on c.ordid=d.ordid and  a.oid=#{oid} and b.state=1 and c.end>=NOW() and c.start<=NOW() and d.done=0")
    List<Demand> findByoid(@Param("oid")Integer oid);//通过oid找到房东房间现有的请求

    @Select("select * from demand where ordid=#{ordid}")
    List<Demand> findByordid(@Param("ordid")Integer ordid);//通过ordid获得房客提出的所有请求

    @Select("SELECT a.oid,b.rid,c.ordid,c.realname,c.phone,d.did,d.dtype,d.note,d.done " +
            "FROM owner a " +
            "inner JOIN aroom b " +
            "on a.oid=b.oid  " +
            "inner join orders c " +
            "on b.rid=c.rid " +
            "inner join demand d " +
            "on c.ordid=d.ordid and  b.rid=#{rid} and b.state=1 and c.end>=NOW() and c.start<=NOW() and d.done=0")
    List<Demand> findByrid(@Param("rid")Integer rid);//通过rid获得房客提出的所有请求

    @Insert("insert into demand(dtype,note,ordid,done) " +
            "values (#{dtype},#{note},#{ordid},0)")
    int insert(Demand demand);

    int update(Demand demand);

    @Select("select * from demand where did=#{did}")
    Demand findBydid(Integer did);
}
