package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Customer;
import com.gaogao.easylock_back.entity.Owner;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CustomerMapper {

    @Select("SELECT * FROM CUSTOMER")
    List<Customer> findAll();

    @Insert("insert into customer(username,passwd,realname,gender,idnum,phone) " +
            "values (#{username},#{passwd},#{realname},#{gender},#{idnum},#{phone})")
    int insert(Customer customer);

    int update(Customer customer);

    @Delete("delete from customer where cid=#{cid}")
    Integer deleteById(@Param("cid") Integer cid);

    @Select("SELECT * FROM CUSTOMER where username=#{username}")
    Customer selectOneByusername(@Param("username") String username);

    @Select("SELECT * FROM customer where username=#{username} and passwd=#{passwd}")
    Customer selectOnetoLogin(@Param("username") String username, @Param("passwd") String passwd);

}
