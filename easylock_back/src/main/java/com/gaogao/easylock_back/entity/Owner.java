package com.gaogao.easylock_back.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Owner {
    private Integer oid;
    private String username;
    private String passwd;
    private String realname;
    private String gender;
    private String idnum;
    private String phone;

}
