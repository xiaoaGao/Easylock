package com.gaogao.easylock_back.mapper;

import com.gaogao.easylock_back.entity.Aroom;
import com.gaogao.easylock_back.entity.Pwdkey;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PwdkeyMapper {

    @Insert("insert into pwdkey(password,rid,starttime,endtime,times) " +
            "values (#{password},#{rid},#{starttime},#{endtime},#{times})")
    int insert(Pwdkey pwdkey);

    int update(Pwdkey pwdkey);

    @Select("SELECT pid FROM pwdkey where password=#{password}")
    Pwdkey keyisexist(@Param("password") String password);

    @Select("SELECT * FROM pwdkey where password=#{password} ")
    Pwdkey findpwdBypwd(@Param("password") String password);

    @Select("SELECT * FROM pwdkey where rid=#{rid}")
    Pwdkey findByRid(@Param("rid") Integer rid);

    @Delete("delete from pwdkey where pid=#{pid}")
    Integer deleteBypid(@Param("pid") Integer pid);//使用pid删除密码钥匙

    @Delete("delete from pwdkey where endtime<NOW() or times<=0")
    Integer deleteDead();//删除已经没用的钥匙

    @Select("SELECT * FROM pwdkey where rid=#{rid}")
    List<Pwdkey> getroomkeys(@Param("rid") Integer rid);
}
