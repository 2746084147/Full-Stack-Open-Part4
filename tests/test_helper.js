const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    "title": "test1",
    "author": "Johnny",
    "url": "https://www.baidu.com",
    "likes": "0",
    "userId": "67a6101c628fa0ee28dee60f"
  },
  {
    "title": "test2",
    "author": "Joe",
    "url": "https://www.baidu.com",
    "likes": "1",
    "userId": "67a6101c628fa0ee28dee60f"
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willRemoveThisSoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
