import Vue from 'vue'
import Router from 'vue-router'
import Races from '../components/Races'
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'
import NewRace from '../components/race/NewRace'
import EditRace from '../components/race/EditRace'
import ProgressRace from '../components/race/ProgressRace'
const jwt = require('jsonwebtoken')

Vue.use(Router)

function loggedInRedirectHome (to, from, next) {
  var decode = getDecode()
  if (decode.loggedIn) {
    next({name: 'Races'})
  } else {
    next()
  }
}

function notLoggedInRedirectLogin (to, from, next) {
  if (localStorage.token) {
    if (to.name === 'EditRace') {
      mayEditRace(to.params.created_by, getDecode().username, next)
    } else {
      next()
    }
  } else {
    next({name: 'Login'})
  }
}

function mayEditRace (createdBy, username, next) {
  if (createdBy === username || getDecode().role === 'admin') {
    next()
  } else {
    next({name: 'Races'})
  }
}

function getDecode () {
  if (localStorage.token) {
    return jwt.decode(localStorage.token, {complete: true}).payload
  } else {
    return false
  }
}

export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Races',
        props: { user: getDecode() },
        component: Races,
        beforeEnter: notLoggedInRedirectLogin
      },
      {
        path: '/auth/signup',
        name: 'Signup',
        component: Signup,
        beforeEnter: loggedInRedirectHome
      },
      {
        path: '/auth/login',
        name: 'Login',
        component: Login,
        beforeEnter: loggedInRedirectHome
      },
      {
        path: '/new',
        name: 'NewRace',
        component: NewRace,
        beforeEnter: notLoggedInRedirectLogin
      },
      {
        path: '/edit/:race/:created_by',
        name: 'EditRace',
        component: EditRace,
        beforeEnter: notLoggedInRedirectLogin
      },
      {
        path: '/progress/:id',
        name: 'ProgressRace',
        component: ProgressRace,
        props: { user: getDecode() },
        beforeEnter: notLoggedInRedirectLogin
      },
    ]
  })