<template>
  <div class="menu">
    <div class="menu-bar">
      <div class="app-name">
        <p>RestRace</p>
      </div>
      <div v-if="user" class="user">
        <span class="username" v-text="user.username + ' (' + user.role + ')'"></span>
        <i @click="logOut" class="fas fa fa-sign-out menu-icon signout"></i>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "../../services/AuthService";
export default {
  name: "MenuBar",
  data() {
    return {
      user: null
    };
  },
  methods: {
    async getLoggedInUser() {
      await AuthService.getLoggedInUser({
        token: localStorage.token
      }).then(response => {
        if (response.user) {
          this.user = response.user;
        }
      });
    },
    logOut: function() {
      localStorage.clear();
      this.user = null;
      location.reload();
      this.$router.push({ name: "Login" });
    }
  },
  mounted() {},
  created() {
    if (localStorage.token) {
      this.getLoggedInUser();
    }
  }
};
</script>

<style scoped>
.menu-bar {
  width: 100%;
  height: 75px;
  background-color: #0d172e;
}
.app-name {
  width: 40%;
  float: left;
}
.app-name p {
  font-size: 50px;
  color: #ffffff;
  font-weight: 100;
  margin: 0;
  padding-left: 10px;
}
.user {
  width: 40%;
  float: right;
  text-align: right;
  padding-top: 10px;
}
.user span {
  color: white;
  font-size: 30px;
  padding-right: 20px;
}
.menu-icon {
  width: 5px;
  font-size: 25px;
  margin-right: 25px;
  color: #5584ff;
}
.signout {
  cursor: pointer;
}
</style>
