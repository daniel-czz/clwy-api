const express = require('express');
const router = express.Router();
const { Course, Category, User } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询首页数据
 * GET /
 */
router.get('/', async function (req, res, next) {
  try{
    const categories = await Category.findAll({
        order: [['rank', 'ASC'], ['id', 'DESC']]
    });
  
    success(res, '查询分类成功。', { categories });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
