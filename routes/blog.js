var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');

router.get('/detail', (req, res, next) => {
  const result = getDetail(req.query.id);
  return result.then(data => {
    res.json(new SuccessModel(data));
  });
});

router.get('/list', (req, res, next) => {
  let author = req.query.author || '';
  const keyword = req.query.keyword || '';

  if (req.query.isadmin) {
    // 管理员界面
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }
    // 强制查询自己的博客
    author = req.session.username;
    // }
  }
  const result = getList(author, keyword);
  return result.then(listData => {
    res.json(new SuccessModel(listData));
  });
});

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then(data => {
    res.json(new SuccessModel(data));
  });
});

router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body);
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel('success'));
    } else {
      res.json(new ErrorModel('failed'));
    }
  });
});

router.post('/del', loginCheck, (req, res, next) => {
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel('del success'));
    } else {
      res.json(new ErrorModel('del failed'));
    }
  });
});
module.exports = router;
