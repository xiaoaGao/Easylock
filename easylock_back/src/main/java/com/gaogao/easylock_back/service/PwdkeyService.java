package com.gaogao.easylock_back.service;


import com.gaogao.easylock_back.controller.givenorder;
import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Pwdkey;
import com.gaogao.easylock_back.mapper.PwdkeyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
public class PwdkeyService {
    @Autowired
    private PwdkeyMapper pwdkeyMapper;
    @Autowired
    private OrdersService ordersService;

    //插入或修改
    public int save(Pwdkey pwdkey){
        if(pwdkey.getPid()==null){
            return pwdkeyMapper.insert(pwdkey);
        }
        else{
            return pwdkeyMapper.update(pwdkey);
        }
    }
    public Pwdkey setPwdkey(Pwdkey pwdkey) {
        //设置密码钥匙,返回有无成功
        givenorder given = new givenorder();
        given.setStart(pwdkey.getStarttime());
        given.setEnd(pwdkey.getEndtime());
        given.setRid(pwdkey.getRid());

        if (ordersService.islegal(given)) {
            //时间合法
            String key=randomkey(8);//生成8位随机密码
            while (keyisexist(key))
                key=randomkey(8);//直到生成的密码不重复
            pwdkey.setPassword(key);
            pwdkeyMapper.insert(pwdkey);
            return pwdkey;
        }
        return null;
    }
    public int unlock(Pwdkey pwdkey) {
        String password=pwdkey.getPassword();
        Pwdkey p=pwdkeyMapper.findpwdBypwd(password);
        if(p==null)
            return 2;//密码不对，错误代码2
        //密码钥匙开门,成功就返回true，否则返回false
        if(ordersService.getroomstate(p.getRid()))
            return 1;//判断房间现在是否有人在住，有的话就拒绝开门,错误代码1
        Date date=new Date();
        int times=p.getTimes();
        if(times<=0)
            return 3;//开锁机会用完，拒绝开锁，错误代码3
        if(!ordersService.daycontain(date,p.getStarttime(),p.getEndtime()))
            return 4;//判断现在的时间是否在密码钥匙的有效时间内，错误代码4
        times--;//消耗一次开锁次数
        p.setTimes(times);
        pwdkeyMapper.update(p);
        return 0;//允许开门，返回0信号
    }
    public int getrid(Pwdkey pwdkey) {
        //找到钥匙对应的rid
        Pwdkey p=pwdkeyMapper.findpwdBypwd(pwdkey.getPassword());
        if(p==null)
            return 0;//不存在
        return p.getRid();//返回这个钥匙的rid
    }
    public boolean keyisexist(String randomkey) {
        //判断随机生成的密码是否已经存在
        if(pwdkeyMapper.keyisexist(randomkey)==null)
            return false;//不存在
        return true;//已经存在了
    }

    //产生len位随机数
    public  String randomkey(int len){
        char charr[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray();
        StringBuilder sb = new StringBuilder();
        Random r = new Random();
        for (int x = 0; x < len; ++x) {
            sb.append(charr[r.nextInt(charr.length)]);
        }
        return sb.toString();

    }

    }
