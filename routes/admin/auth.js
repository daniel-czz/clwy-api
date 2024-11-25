const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../../models');
const { Op } = require('sequelize');
const {success ,failure} = require('../../utils/responses');
const { NotFoundError, BadRequestError,  UnauthorizedError} = require('../../utils/errors')
const bcrypt = require('bcryptjs'); //加密/解密 密码 
const jwt = require('jsonwebtoken'); // jwt token - jsonwebtoken
 

router.get('/sign_in', async function(req, res){
    try{
        const { login, password } = req.body;

        if(!login) throw new BadRequestError('邮箱/用户名不能为空')
        if(!password) throw new BadRequestError('密码必须填写')

        const condition = {
            where: {
                [Op.or]: [
                    {email: login},
                    {username: login}
                ]
            }
        }

        // 检验用户是否存在
        let user = await User.findOne(condition)
        if(!user) throw new NotFoundError('邮箱/用户名你存在')

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid)  throw new UnauthorizedError('密码错误')
        
        // 验证是不是管理员
        if (user.role != 100) throw new UnauthorizedError('您没有权限登录管理后台')
        
        // 生成身份验证令牌 - 密钥加密 userId
        const token = jwt.sign(
            {userId: user.id}, 
            process.env.SECRET, 
            {expiresIn: '30d'}
        );
        success(res, '登录成功。', { token });


    } catch (err){
        failure(res, err);
    }
})

module.exports = router;