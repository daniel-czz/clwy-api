const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../models');
const { Op } = require('sequelize');
const {success ,failure} = require('../utils/responses');
const { NotFoundError, BadRequestError,  UnauthorizedError} = require('../utils/errors')
const jwt = require('jsonwebtoken'); // jwt token - jsonwebtoken
 
/**
 * 
 * @param {*} req --> 点击发送的请求 的详情 
 * @param {*} res 
 * @param {*} next --> 继续执行该请求
 */
module.exports = async (req, res, next) => {
    try{

        // 检查接口是否包含了 token
        const { token } = req.headers
        if(!token) throw new UnauthorizedError('当前接口需要认证才能访问')

        // 解密 userId - 验证token是否正确，需要用jwt包里提供的方法。
        // 我们的token 是通过加密userId来得到的 
        const decoded = jwt.verify(token, process.env.SECRET)
        const { userId } = decoded

        const user = await User.findByPk(userId)
        
        if(!user) throw new NotFoundError('用户不存在')
        if(user.role != 100) throw new UnauthorizedError('您没有权限访问当前接口')

        //可以在req中存储一些信息，这样后续中间件和路由里都能使用。
        req.user = user  

        // 继续接下来的接口调用
        next()

    } catch (err){
        failure(res, err);
    }
}

