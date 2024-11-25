const express = require('express'); // 引入 express
const router = express.Router(); // 引入 router

const { Category, Course } = require("../../models") //引入模型 也就是table 
const { Op } = require('sequelize') // 引入 sequelize 的 sql operator 
const {
    success,
    failure
  } = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors')
const course = require('../../models/course');
  



async function getCategory(req){
    const { id } = req.params

    const category = await Category.findByPk(id);

    if(!category) throw new NotFoundError(`ID ${id} not found`)
    
    return category
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
    return {
      name: req.body.name,
      rank: req.body.rank
    };
}

/**
 * 搜索种类详情
 */
router.get('/:id', async function(req, res){
    try{
        const category = await getCategory(req) 
        success(res, '搜索成功', {category})
    }catch(err){
        failure(res, err)
    }
    
})

/**
 * 创建种类
 */
router.post('/', async function(req, res){
    try{
        let body = filterBody(req)
        const category = await Category.create(body)
        success(res, '创建成功', {category}, 201)
    }catch(err){
        failure(res, err)   
    }
    
})

/**
 * 删除种类 
 */
router.delete('/:id', async function(req, res){
    try{
        const category = await getCategory(req)

        const count = await Course.count({where: {categoryId: req.params.id}})
        if(count>0) throw new Error('当前分类无法删除')

        await category.destroy()
        success(res, '删除成功')

    }catch(err){
        failure(res, err)
    }
})

/**
 * 更改种类 
 */
router.put('/:id', async function(req, res){
    try{
        const category = await getCategory(req)
        const body = filterBody(req)
        await category.update(body)
        success(res, '更新成功', {category}, 201)

    }catch(err){
        failure(res, err)
    }
})

/**
 * 种类列表 - 模糊搜索 + 分页
 */
router.get('/', async function(req, res){
    try{
        const query = req.query
        console.log(query)
        const pageSize = Math.abs(Number(query.pageSize)) || 10 
        const currentPage = Math.abs(Number(query.currentPage)) || 1 
        const offset = (currentPage-1)*pageSize

        const condition = {
            order: [['rank', 'ASC'], ['id', 'ASC']],
            limit: pageSize, 
            offset
        }
        if(query.name) {
            condition.where = { 
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }

        const {count, rows} = await Category.findAndCountAll(condition)

        res.json({
            status: true, 
            message: '查找成功',
            data: {
                categories: rows, 
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