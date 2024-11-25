const express = require('express'); // 引入 express
const router = express.Router(); // 引入 router

const { User, sequelize } = require("../../models") //引入模型 也就是table 
const { Op } = require('sequelize') // 引入 sequelize 的 sql operator 
const {
    success,
    failure
  } = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors')




async function getUser(req){
    const { id } = req.params

    const user = await User.findByPk(id)

    if(!user) throw new NotFoundError(`ID ${id} not found`)
    
    return user
}

function filterBody(req) {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
    };
}

/**
 * 搜索用户详情
 */
router.get('/:id', async function(req, res){
    try{
        const user = await getUser(req) 
        success(res, '搜索成功', {user})
    }catch(err){
        failure(res, err)
    }
    
})

/**
 * 创建用户
 */
router.post('/', async function(req, res){
    try{
        let body = filterBody(req) 
        const user = await User.create(body)
        success(res, '创建成功', {user}, 201)
    }catch(err){
        failure(res, err)   
    }
    
})

/**
 * 删除用户 
 */
router.delete('/:id', async function(req, res){
    try{
        const user = await getUser(req)
        await user.destroy()
        success(res, '删除成功')

    }catch(err){
        failure(res, err)
    }
})

/**
 * 更改用户 
 */
router.put('/:id', async function(req, res){
    try{
        const user = await getUser(req)
        const body = filterBody(req)
        await user.update(body)
        success(res, '更新成功', {user}, 201)

    }catch(err){
        failure(res, err)
    }
})

/**
 * 用户列表 - 模糊搜索 + 分页
 */
router.get('/', async function(req, res){
    try{
        const query = req.query
        console.log(query)
        const pageSize = Math.abs(Number(query.pageSize)) || 10 
        const currentPage = Math.abs(Number(query.currentPage)) || 1 
        const offset = (currentPage-1)*pageSize

        const condition = {
            order: [['id', 'DESC']], 
            limit: pageSize, 
            offset
        }
        
        if (query.email) {
            condition.where = {
              email: {
                [Op.eq]: query.email
              }
            };
          }
          
          if (query.username) {
            condition.where = {
              username: {
                [Op.eq]: query.username
              }
            };
          }
          
          if (query.nickname) {
            condition.where = {
              nickname: {
                [Op.like]: `%${ query.nickname }%`
              }
            };
          }
          
          if (query.role) {
            condition.where = {
              role: {
                [Op.eq]: query.role
              }
            };
          }          

        const {count, rows} = await User.findAndCountAll(condition)

        res.json({
            status: true, 
            message: '查找成功',
            data: {
                users: rows, 
                pagination: { 
                    total: count, 
                    currentPage,
                    pageSize,
                }
            }
        })

    }catch(err){
        failure(res, err)

    }
})

 


module.exports = router // 导出 router 