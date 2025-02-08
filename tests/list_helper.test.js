const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('Blogs', () => {
  test('dummy returns one', () => {
    const blogs = []
  
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  const emptyList = []

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  const biggerList = [
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

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, 2338)
  })
})
