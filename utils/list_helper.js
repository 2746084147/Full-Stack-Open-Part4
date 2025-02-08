// import _ from lodash
const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.length === 0 
    ? 0 
    : blogs.reduce((prev, curr) => prev + curr.likes, 0)
}

const favoriteBlog = blogs => {
  const maxVal = blogs.reduce((max, item) => Math.max(max, item.likes), 0)
  const index = blogs.findIndex(item => item.likes === maxVal)
  console.log(blogs[index]);
  
  return ({
    'title': blogs[index].title,
    'author': blogs[index].author,
    'likes': blogs[index].likes,
  })
}


const mostBlogs = blogs => {
  // console.log(_.groupBy(blogs, 'author'))
  const group = _.groupBy(blogs, 'author')
  return _.maxBy(_.map(group, (blogs, author) => {
    return {
      author: author,
      blogs: blogs.length
    }
  }), 'blogs')
}

const mostLikes = blogs => {
  const group = _.groupBy(blogs, 'author')
  console.log(group);
  
  return _.maxBy(_.map(group, (blogs, author) => {
    return {
      author: author,
      likes: blogs.reduce((prev, curr) => prev + curr.likes, 0)
    }
  }), 'likes')
}
module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}