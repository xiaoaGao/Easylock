package com.gaogao.easylock_back.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class roomporder {
    //room表加上order表
    private Aroom aroom;
    private Fangyuan fangyuan;
    private Orders orders;
    private Integer ready;//为1则表示已经就绪，可以入住。0则表示还无法入住
}
