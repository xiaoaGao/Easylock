package com.gaogao.easylock_back.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Demand {
    private Integer did;
    private Integer dtype;//需求类型，1表示延长住宿天数，2更换床单3更换毛巾4打扫房间5维修电器
    private Integer ordid;
    private Integer done;
    private Integer  note;

    //以下非demand字段
    private Integer oid;
    private String  realname;
    private String  phone;
    private Integer  rid;
}
