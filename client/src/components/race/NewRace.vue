<template>
  <div class="races">
    <div class="header">
      <h1>Add Race</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>
    </div>
      <div class="form">
        <input type="text" name="title" placeholder="TITLE" v-model="title"><br/>
        <vue-google-autocomplete
          ref="address"
          id="map"
          classname="search-location"
          placeholder="Search"
          v-on:placechanged="getAddressData"
          types="establishment"
          country="nl"
        >
        </vue-google-autocomplete>
        <div>
          <button v-if="address" type="button" @click="clearAddress"><i class="fa fa-trash text-danger"></i></button>
          <button v-if="address" type="button" @click="addAddress"><i class="fa fa-plus text-success"></i></button>
        </div>
      </div>
      <div v-if="waypoints.length">
        <h2>Added waypoints</h2>
        <table class="table">
          <tr>
            <th>Waypoint</th>
            <th></th>
          </tr>
          <tr v-for="(waypoint, index) in waypoints" :key="index">
            <td style="text-align: left;" v-text="waypoint.name"></td>
            <td><i @click="removeWaypoint(index)" class="fa fa-trash text-danger"></i></td>
          </tr>
        </table>
      </div>
      <div class="save">
        <button @click="addRace" class="btn btn-success create">Create</button>
        <router-link v-bind:to="{ name: 'Races' }"><button class="btn btn-danger cancel">Cancel</button></router-link>
        <div style="clear: both;"></div>
      </div>
  </div>
</template>

<script>
import RaceService from '@/services/RaceService'
import AuthService from '@/services/AuthService'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import io from 'socket.io-client'

export default {
  name: 'NewRace',
  components: { VueGoogleAutocomplete },
  data () {
    return {
      title: '',
      waypoints: [],
      address: '',
      errorMessage: '',
      user: {},
      socket: io.connect(),
    }
  },
  methods: {
    async addRace () {
      if (this.title === '' || this.waypoints.length <= 0) {
        this.errorMessage = 'The titel can not be empty, and there needs to be atleast one waypoint'
      } else {
        await RaceService.addRace({
          title: this.title,
          waypoints: this.waypoints,
          created_by: this.user
        })
        .then(response => {
          if (response.data.success) {
            this.socket.emit('ADDED_RACE', {
              race: response.data.race
            })
            this.$router.push({ name: 'Races' })
          }
        })
        .catch(error => {
          this.errorMessage = error.response.data.message
        })
      }
    },
    removeWaypoint: function (index) {
      this.waypoints.splice(index, 1)
    },
    getAddressData: function (addressData) {
      this.address = addressData
    },
    clearAddress: function () {
      this.$refs.address.clear()
      this.address = ''
    },
    addAddress: function () {
      this.$set(this.address, 'name', this.$refs.address.$refs.autocomplete.value)
      this.waypoints.push(this.address)
      this.clearAddress()
    },
    async getLoggedInUser () {
      await AuthService.getLoggedInUser({
        token: localStorage.token
      })
      .then(response => {
        if (response.user) {
          this.user.username = response.user.username
          this.user._id = response.user._id
          return this.user
        }
      })
      .catch(error => {
        this.errorMessage = error.response.data.message
      })
    }
  },
  mounted () {
    this.$refs.address.focus()
    this.getLoggedInUser()
  }
}
</script>
<style type="text/css" scoped>
.header {
  text-align: center;
}
.races {
  width: 100%;
}
.form {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.form input {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.add_race_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
.races {
  text-align: center;
}
.table {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
}
.table td, .table th {
  border: 1px solid gray;
  padding: 8px;
}
.table tr:nth-child(even){background-color: #f2f2f2;}
.table td:nth-child(even) {text-align: center;}
.table td:nth-child(even) i {cursor: pointer;}

.table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0d172e;
  color: white;
}
.save {
  width: 250px;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
}
.save .create {
  float: right;
}
.save .cancel {
  float: left;
}
</style>
