package com.gaogao.easylock_back.controller;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.gaogao.easylock_back.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class givenorder {
    //接收前端传来的带数组的订单信息
    private Integer rid;
    private Customer[] customers;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date start;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date end;

}
