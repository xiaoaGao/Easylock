package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Customer;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CustomerMapper {

    @Select("SELECT * FROM CUSTOMER")
    List<Customer> findAll();

    @Insert("insert into customer(username,passwd,idnum,phone) values (#{username},#{passwd},#{idnum},#{phone})")
    int insert(Customer customer);

    int update(Customer customer);

    @Delete("delete from customer where cid=#{cid}")
    Integer deleteById(@Param("cid") Integer cid);
}
