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
    removeuse(data){  //删除单一用户信息
        return info({
            url:`users/${data}`,
            method:"delete",
        })
    },
    rightslist(){  //所有权限列表
        return info({
            url:`rights/list`,
            method:"get",
        })
    },
    roles(){  // 角色列表
        return info({
            url:`roles`,
            method:"get",
        })
    },
    roleId(role,id){  //删除角色指定权限
        return info({
            url:`roles/${role}/rights/${id}`,
            method:"delete"
        })
    },
    rightslisttree(){  //所有权限列表{树桩图}
        return info({
            url:`rights/tree`,
            method:"get",
        })
    },
    rights(data,idstr){ //角色授权
        return info({
            url:`roles/${idstr}/rights`,
            method:"post",
            data:data   
        })
    },
    toroles(){//用户页角色列表
        return info({
            url:"roles",
            method:"get"
        })
    },
    tousers(id,Right){  //分配用户角色
        return info({
            url:`users/${id}/role`,
            method:"put",
            data:Right
        })    
    },
    cateList(params){ //商品分类数据列表
        return info({
            url:"categories",
            method:"get",
            params
        })

    },
    categories(params){
        return info({
            url:app.categories,
            method:"get",
            params
        })
    },
    setcategories(data){
        return info({
            url:app.setcategories,
            method:"post",
            data
        })
    }

}
export default use