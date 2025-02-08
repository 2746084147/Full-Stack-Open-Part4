const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { promiseHooks } = require('node:v8')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('viewing a specific blog', () => {
  test("check id", async () => {

    const response = await api.get('/api/blogs')
  
    response.body.forEach(blog => {
      assert(blog.id, `Blog post is missing 'id' property: ${JSON.stringify(blog)}`)
      assert(typeof blog.id === 'string', `Expected 'id' to be a string, but got ${typeof blog.id}`)
    })
    // console.log('the body is', response.body);
    // console.log('the id is ', id);
  })
  
  test('a valid blog can be added', async () => {
    const newBlog = {
      "title": "New Blog",
      "author": "author 1",
      "url": "https://www.baidu.com",
      "likes": "10",
      "userId": "67a6101c628fa0ee28dee60f"
    }
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1bmppbmciLCJpZCI6IjY3YTYxMDFjNjI4ZmEwZWUyOGRlZTYwZiIsImlhdCI6MTczODk4MTIyOCwiZXhwIjoxNzM4OTg0ODI4fQ.hB1QI80rTbDTbkkJihKqwDnEyVNWGgDoJK87Uo3_vfM'
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogAtEnd = await helper.blogsInDb()
    const title = blogAtEnd.map(e => e.title)
    
    assert.strictEqual(blogAtEnd.length, title.length)
    assert(title.includes('New Blog'))
  })
  
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
  
  describe('check validation', () => {
    test('if the likes property is missing freom the request, default to 0', async () => {
      const newBlog = {
        title: 'title',
        author: "author 2",
        url: "https://www.baidu.com",
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
      
      const blogAtEnd = await helper.blogsInDb()
    
      assert.strictEqual(blogAtEnd[blogAtEnd.length - 1].likes, 0)
    })
    
    test('blog w/o title is not added', async () => {
      const newBlog = {
        "author": "author 2",
        "url": "https://www.baidu.com",
        "likes": "10"
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      
      const blogAtEnd = await helper.blogsInDb()
    
      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
    })
    
    test('blog w/o url is not added', async () => {
      const newBlog = {
        title:'title',
        author: "author 2",
        likes: "10"
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      
      const blogAtEnd = await helper.blogsInDb()
    
      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
    })
  })
  
  test('a note can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
    const title = blogsAtEnd.map(e => e.title)
    assert(!title.includes(blogToDelete.title))
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
  
  test('a blog can be updated', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]
    
    const newLikes = blogToUpdate.likes + 114
    
    const newBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: newLikes
    }
    // console.log('newblog',newBlog);
    
    // .send() is important
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    // console.log('update');
    
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(e => e.id === blogToUpdate.id)
    
    assert.strictEqual(updatedBlog.likes, newLikes)
  })  
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})


after(async () => {
  await mongoose.connection.close()
})