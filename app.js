const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config() 

const adminAuth = require('./middlewares/admin_auth')
const userAuth = require('./middlewares/user_auth')

// 前端 
const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories')
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters')
const articlesRouter = require('./routes/articles')
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users')
const likesRouter = require('./routes/likes');

// 后台 
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');




const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 前台理由文件
app.use('/', indexRouter);
app.use('/categories', categoriesRouter)
app.use('/courses', coursesRouter)
app.use('/chapters', chaptersRouter)
app.use('/articles', articlesRouter)
app.use('/settings', settingsRouter)
app.use('/search', searchRouter)
app.use('/auth', authRouter)
app.use('/users', userAuth, usersRouter)
app.use('/likes', userAuth, likesRouter);


// 后台路由文件 
app.use('/admin/articles', adminAuth, adminArticlesRouter)
app.use('/admin/categories', adminAuth, adminCategoriesRouter)
app.use('/admin/settings', adminAuth, adminSettingsRouter)
app.use('/admin/users', adminAuth, adminUsersRouter)
app.use('/admin/courses', adminAuth, adminCoursesRouter)
app.use('/admin/chapters', adminAuth, adminChaptersRouter)
app.use('/admin/charts', adminAuth, adminChartsRouter)
app.use('/admin/auth', adminAuthRouter)




module.exports = app;
