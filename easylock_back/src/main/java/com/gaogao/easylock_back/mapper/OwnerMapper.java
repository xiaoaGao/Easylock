package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Owner;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OwnerMapper {

    @Select("SELECT * FROM owner")
    List<Owner> findAll();

    @Insert("insert into owner(username,passwd,realname,gender,idnum,phone) " +
            "values (#{username},#{passwd},#{realname},#{gender},#{idnum},#{phone})")
    int insert(Owner owner);

    int update(Owner owner);

    @Delete("delete from owner where oid=#{oid}")
    Integer deleteById(@Param("oid") Integer oid);

    @Select("SELECT * FROM owner where username=#{username}")
    Owner selectOneByusername(@Param("username") String username);

    @Select("SELECT * FROM owner where phone=#{phone}")
    Owner selectOneByphone(@Param("phone") String phone);

    @Select("SELECT * FROM owner where username=#{username} and passwd=#{passwd}")
    Owner selectOnetoLogin(@Param("username") String username,@Param("passwd") String passwd);
}