var express = require('express');
var router = express.Router();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const result = login(username, password);
  // 登录

  // const { username, password } = req.body;

  // console.log('result', result);
  return result.then(data => {
    if (data.username) {
      // 操作cookie path=/本网站中所有的页面都会生效 httpOnly 只允许后端修改cookie expires=${getCookieExpires() 设置过期时间
      //  设置session
      req.session.username = data.username;
      req.session.realname = data.realname;

      res.json(new SuccessModel());
      return;
    }
    res.json(new ErrorModel('Login Failed'));
  });
});

router.get('/login-test', (req, res, next) => {
  if (req.session.username) {
    res.json({
      errno: 0,
      msg: '已登录'
    });
    return;
  }
  res.json({
    errno: -1,
    msg: '未登录'
  });
});
// router.get('/session-test', (req, res, next) => {
//   const session = req.session;
//   if (session.viewNum == null) {
//     session.viewNum = 0;
//   }

//   session.viewNum++;
//   res.json({ viewNum: session.viewNum });
// });
module.exports = router;
