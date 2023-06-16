const express = require('express');
const router = express.Router();
const Posts = require('../schemas/posts.js');

// 전체 게시글 목록 조회
router.get('/', async (req, res) => {
  const post = await Posts.find({}, { __v: 0, password: 0, content: 0 }).sort({
    createdAt: -1,
  });
  const viewPost = post.map((value) => {
    return {
      post: value._id,
      title: value.title,
      userName: value.userName,
      createdAt: value.createdAt,
    };
  });
  res.json({ data: viewPost });
});

// 게시글 작성
router.post('/', async (req, res) => {
  try {
    const { userName, password, title, content } = req.body;
    await Posts.create({ userName, password, title, content });
    return res.status(200).json({ message: '게시글을 생성하였습니다.' });
  } catch {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

// 게시글 조회
router.get('/:_postId', async (req, res) => {
  try {
    const post = await Posts.findOne(
      { _id: _postId },
      { __v: 0, password: 0, content: 0 }
    );
    const viewPost = {
      post: post._id,
      title: post.title,
      userName: post.userName,
      content: post.content,
      createdAt: post.createdAt,
    };
    res.json({ data: viewPost });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

// 게시글 수정
router.put('/:_postId', async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    const [post] = await Posts.find({ _id: _postId });

    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }

    if (password === post.password) {
      await Posts.updateOne(
        { _id: postId },
        { $set: { title: title, content: content } }
      );
      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } else {
      return res.status(404).json({ message: '비밀번호가 다릅니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

// 게시글 삭제
router.delete('/:_postId', async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password } = req.body;
    const [post] = await Posts.find({ _id: _postId });

    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }

    if (password === post.password) {
      await Posts.deleteOne({ _id: _postId });
      return res.status(200).json({ message: '비밀번호가 다릅니다.' });
    }
  } catch {
    res.status(400).send(err.message);
  }
});

module.exports = router;
