<template>
  <div class="races">
    <div class="header">
      <h1>Sign up</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>
    </div>
    <div class="form">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="password" v-model="password" placeholder="Password" required>
    </div>
    <div class="save">
      <button @click="signUp" class="btn btn-primary sign-up">Sign up</button>
      <button @click="logIn" class="btn btn-secondary log-in">Log in</button>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'
export default {
  name: 'Signup',
  data () {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async signUp () {
      if (this.username !== '' && this.password !== '') {
        await AuthService.addUser({
          username: this.username,
          password: this.password
        })
        .then(response => {
          if (response.data.success) {
            this.$router.push({ name: 'Login' })
          }
        })
        .catch(error => {
          if (typeof error.response.data.message === 'object') {
            this.errorMessage = error.response.data.message.message
          } else {
            this.errorMessage = error.response.data.message
          }
        })
      } else {
        this.errorMessage = 'Username and/or password needs to be filled in'
      }
    },
    logIn: function () {
      this.$router.push({ name: 'Login' })
    }
  },
  mounted () {},
  created () {}
}
</script>
<style type="text/css" scoped>
.header {
  text-align: center;
}
.form {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.form input {
  width: 500px;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.table {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
}
.save {
  width: 250px;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
}
.save .sign-up {
  float: right;
}
.save .log-in {
  float: left;
}
</style>
