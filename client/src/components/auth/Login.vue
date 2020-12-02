<template>
  <div class="races">
    <div class="header">
      <h1>Log in</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>
    </div>
    <div class="form">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="password" v-model="password" placeholder="Password" required>
    </div>
    <div class="save">
      <button @click="signUp" class="btn btn-secondary sign-up">Sign up</button>
      <button @click="logIn" class="btn btn-primary log-in">Log in</button>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async logIn () {
      await AuthService.Login({
        username: this.username,
        password: this.password
      })
      .then(response => {
        if (response.data.success) {
          localStorage.token = response.data.token
          location.reload()
          this.$router.push({ name: 'Races' })
        }
      })
      .catch(error => {
        this.errorMessage = error.response.data.message
      })
    },
    signUp: function () {
      this.$router.push({ name: 'Signup' })
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
  float: left;
}
.save .log-in {
  float: right;
}
</style>
