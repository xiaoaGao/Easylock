package com.gaogao.easylock_back.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    private Integer cid;
    private String username;
    private String passwd;
    private String idnum;
    private String phone;
}
