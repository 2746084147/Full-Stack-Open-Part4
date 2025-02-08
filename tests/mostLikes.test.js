const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


describe('favorite blog', () => {
  const mostLikes = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      "title": "This is a title.",
      "author": "Joe",
      "url": "https://www.bilibili.com",
      "likes": 100,
      "id": "677d2b9fbaa51a92bd228b63"
    },
    {
      "title": "Wow.",
      "author": "Johnny",
      "url": "https://www.baidu.com",
      "likes": 2233,
      "id": "677d330c3feca8944679edf5"
    }
  ]

  test('the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(mostLikes)
    assert.deepStrictEqual(
      result,
      {
        "title": "Wow.",
        "author": "Johnny",
        "likes": 2233,
      }
    )
  })

  const mostBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: '2',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 52,
      __v: 0
    },
    {
      "title": "This is a title.",
      "author": "Joe",
      "url": "https://www.bilibili.com",
      "likes": 100,
      "id": "677d2b9fbaa51a92bd228b63"
    },
    {
      "title": "Wow.",
      "author": "Johnny",
      "url": "https://www.baidu.com",
      "likes": 2233,
      "id": "677d330c3feca8944679edf5"
    },
    {
      "title": "Wsdfow.",
      "author": "Johnny",
      "url": "https://www.baidu.com",
      "likes": 22,
      "id": "677d330c3feca8944679edf5"
    },
    {
      "title": "Wasd fow.",
      "author": "Johnny",
      "url": "https://www.baidu.com",
      "likes": 23,
      "id": "677d330c3feca8944679edf5"
    }
  ]

  test('mostBlogs', () => {
    const result = listHelper.mostBlogs(mostBlogs)
    assert.deepStrictEqual(
      result,
      {
        author: 'Johnny',
        blogs: 3
      }
    )
  })

  test('mostLikes', () => {
    const result = listHelper.mostLikes(mostBlogs)
    assert.deepStrictEqual(
      result,
      {
        author: 'Johnny',
        likes: 2278
      }
    )
  })
})
