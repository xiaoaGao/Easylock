package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Orders;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OrdersMapper {

    @Insert("insert into orders(rid,realname,phone,idnum,start,end,ordertime) " +
            "values (#{rid},#{realname},#{phone},#{idnum},#{start},#{end},#{ordertime})")
    Integer insert(Orders orders);

    Integer update(Orders orders);

    @Delete("delete from orders where ordid=#{ordid}")
    Integer deleteByOrdid(@Param("ordid") Integer ordid);
    //通过ordid找到orders
    @Select("SELECT * FROM orders WHERE end>=NOW() and ordid =#{ordid}")
    Orders getorderByid(@Param("ordid") Integer ordid);
    //找到rid房还未结束的订单
    @Select("SELECT * FROM orders WHERE end>=NOW() and rid =#{rid}")
    List<Orders> findallunfinish(@Param("rid") Integer rid);
    //用手机号查找还未结束的订单
    @Select("SELECT * FROM orders WHERE end>=NOW() and phone =#{phone}")
    List<Orders> findallunfinishByphone(@Param("phone") String phone);

}
