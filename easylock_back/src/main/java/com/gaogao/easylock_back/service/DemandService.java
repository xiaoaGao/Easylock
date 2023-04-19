package com.gaogao.easylock_back.service;


import com.gaogao.easylock_back.mapper.DemandMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class DemandService {
    @Autowired
    private DemandMapper demandMapper;



}
