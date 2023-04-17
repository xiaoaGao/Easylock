package com.gaogao.easylock_back.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aroom {
    private Integer rid;
    private Integer oid;
    private Integer state;
    private Integer fid;
    private String deviceid;
    private String roomnum;
    private String standard;
    private String jieshao;

}
