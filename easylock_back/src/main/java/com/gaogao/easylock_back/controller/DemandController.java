package com.gaogao.easylock_back.controller;

import com.gaogao.easylock_back.common.Result;
import com.gaogao.easylock_back.entity.Demand;
import com.gaogao.easylock_back.mapper.DemandMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/demand")
public class DemandController {
    @Autowired
    private DemandMapper demandMapper;



}
