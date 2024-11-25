const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../../models');
const { Op } = require('sequelize');
const {
  success,
  failure
} = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors')



/**
 * 获取性别数据
 * PUT /admin/chapters/:id
 */
router.get('/sex', async function (req, res) {
  try {
      const male = await User.count({where: { sex: 0 } }) 
      const female = await User.count({where: { sex: 1 } }) 
      const unknown = await User.count({where: { sex: 2 } }) 

      const data = [
        {value: male, sex:'male'},
        {value: female, sex:'female'},
        {value: unknown, sex:'unknown'}
      ]

      success(res, '查询成功。', { data });
  } catch (error) {
      failure(res, error);
  }
});

router.get('/user', async function(req, res){
    try{
        const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC");
        console.log(results)
        const data = {
            months: [],
            values: [],
        };

        results.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });

        success(res, '查询每月用户数量成功。', { data });
    } catch (err){
        failure(res, err);
    }
})

module.exports = router;