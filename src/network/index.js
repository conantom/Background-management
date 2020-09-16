import info from './http';
import {app} from './api';
import qs from 'qs';

const use={
    login(data){   //登录数据验证
        return info({
            url:app.login,
            method:"post",
            data:qs.stringify(data)
        }) 
    },
    menus(){//左侧菜单数据
        return info({
            url:app.menus,
            method:"get",
            
        }) 
    },
    users(params){//获取用户列表数据
        return info({
            url:app.users,
            method:"get",
            params
        }) 
    },
    state(params){  //状态修改
        return info({
            url:`users/${params.id}/state/${params.mg_state}`,
            method:"put"
        })
    },
    use(data){ // 添加用户
        return info({
            url:app.use,
            method:"post",
            data:qs.stringify(data)
        }) 
    },
    usert(params){
      return info({
        url:`users/${params}`,
        method:"get"
      })

    },
    putuse(data){
        return info({
            url:`users/${data.id}`,
            method:"put",
            data
        })
    },
    removeuse(data){
        return info({
            url:`users/${data}`,
            method:"delete",
        })
    }

}
export default use