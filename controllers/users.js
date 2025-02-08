const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('../app')

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash,
  })
  console.log('create new User done');
  const savedUser = await user.save()
  console.log('successfully saved');
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, url: 1, author: 1})
  response.json(users)
})

module.exports = usersRouter