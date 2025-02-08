const blogsRouter = require('express').Router()
const { response, request } = require('../app')
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const {title, author, url, likes} = request.body
  console.log(request.user);
  
  const user = request.user
  if(!title || !url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: title,
      author: author,
      url: url,
      likes: likes || 0,
      user: user._id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }

})

blogsRouter.get('/:id', async (request, response) => {

  const blogs = await Blog
    .findById(request.params.id).populate('user', {username: 1, name: 1})

  if(blogs) {
    response.json(blogs)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const user = request.user
  if (!user) {
      return response.status(401).json({ error: 'user not found' })
  }

  // 获取博客对象
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
  }

  // 比较博客创建者和当前操作用户
  const blogUserId = blog.user.toString() // 将 MongoDB ObjectId 转换为字符串
  
  if (blogUserId !== user._id.toString()) {
      return response.status(403).json({ error: 'you are not authorized to delete this blog' })
  }

  // 删除博客
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  
})

blogsRouter.put('/:id', async (request, response) => {
  const {title, author, url, likes} = request.body
  const blog = {
    title: title,
    author: author,
    url: url,
    likes: likes
  }
  // console.log(request.body);
  
  const saveBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(saveBlog)
})

module.exports = blogsRouter
