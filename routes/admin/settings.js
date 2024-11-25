const express = require('express'); // 引入 express
const router = express.Router(); // 引入 router

const { Setting, sequelize } = require("../../models") //引入模型 也就是table 
const { Op } = require('sequelize') // 引入 sequelize 的 sql operator 
const {
    success,
    failure
  } = require('../../utils/responses');
  const { NotFoundError } = require('../../utils/errors')



async function getSetting(req){

    const setting = await Setting.findOne()

    if(!setting) throw new NotFoundError(`ID ${id} not found`)
    
    return setting
}

function filterBody(req) {
    return {
      name: req.body.name,
      icp: req.body.icp,
      copyright: req.body.icp,
    };
}


/**
 * 搜索系统设置详情
 */
router.get('/', async function(req, res){
    try{
        const setting = await getSetting(req) 
        success(res, '搜索成功', {setting})
    }catch(err){
        failure(res, err)
    }
    
})


/**
 * 更改系统设置 
 */
router.put('/', async function(req, res){
    try{
        const setting = await getSetting(req)
        const body = filterBody(req)
        await setting.update(body)
        success(res, '更新成功', {setting}, 201)

    }catch(err){
        failure(res, err)
    }
})



 


module.exports = router // 导出 router 