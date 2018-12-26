'use strict'
const questions = require('../models/index').questions
async function home (req, h) {
  let data
  try {
    data = await questions.getLast(10)
  } catch (e) {
    console.error(e);
  }
  return h.view('index',{
    title: 'home',
    user: req.state.user,
    questions: data
  })
}

function register (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }
  return h.view('register',{
    title: 'registro',
    user: req.state.user
  })
}
function login (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }
  return h.view('login',{
    title: 'Ingrese',
    user: req.state.user
  })
}
async function viewQuestion(req, h){
  let data
  try {
    data = await questions.getOne(req.params.id)
    if (!data) {
      return notFound(req, h)
    }
  } catch (e) {
    console.error(e);
  }

  return h.view('question', {
    title: 'Detalles de la pregunta',
    user: req.state.user,
    question: data,
    key: req.params.id
  })
}
function notFound(req, h){
  return h.view('404', null, {layout: 'error-layout'}).code(404)
}
function fileNotFound(req, h){
  const response = req.response
  if (response.isBoom && response.output.statusCode === 404) {
    return h.view('404', null, {layout: 'error-layout'}).code(404)
  }
  return h.continue
}
function ask(req, h){
  if (!req.state.user) {
    return h.redirect('/login')
  }
  return h.view('ask', {
    title: 'Crear pregunta',
    user: req.state.user
  })
}

module.exports = {
  ask: ask,
  home: home,
  register: register,
  fileNotFound: fileNotFound,
  notFound: notFound,
  login: login,
  viewQuestion: viewQuestion
}
