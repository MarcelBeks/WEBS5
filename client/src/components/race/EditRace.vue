<template>
  <div class="races">
    <div class="header">
      <h1>Edit Race</h1>
      <h2 v-text="race.title"></h2>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>
    </div>
    <div class="form">
      <div>
        <vue-google-autocomplete
          ref="address"
          id="map"
          classname="search-location"
          placeholder="Nieuw waypoint"
          v-on:placechanged="getAddressData"
          types="establishment"
          country="nl"
        >
        </vue-google-autocomplete>
      </div>
      <div>
        <button v-if="address" type="button" @click="clearAddress"><i class="fa fa-trash text-danger"></i></button>
        <button v-if="address" type="button" @click="addAddress"><i class="fa fa-plus text-success"></i></button>
      </div>
    </div>
    <table class="table">
      <tr>
        <th>Waypoint</th>
        <th></th>
      </tr>
      <tr v-for="(waypoint, index) in tempWaypoints" :key="index">
        <td v-text="waypoint.name"></td>
        <td><i @click="removeWaypoint(index)" class="fa fa-trash text-danger"></i></td>
      </tr>
    </table>
    <div class="save">
      <button @click="updateRace" class="btn btn-success update">Update</button>
      <router-link v-bind:to="{ name: 'Races' }"><button class="btn btn-danger cancel">Cancel</button></router-link>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
import RaceService from '@/services/RaceService'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
export default {
  name: 'EditRace',
  components: { VueGoogleAutocomplete },
  data () {
    return {
      race: [],
      tempWaypoints: [],
      address: '',
      errorMessage: ''
    }
  },
  methods: {
    async getRace () {
      const response = await RaceService.getRace({
        id: this.$route.params.race
      })
      this.race = response
      this.tempWaypoints = this.race.waypoints
    },
    async updateRace () {
      if (this.tempWaypoints.length <= 0) {
        this.errorMessage = 'There needs to be atleast one waypoint'
      } else {
        await RaceService.updateRace({
          id: this.$route.params.race,
          waypoints: this.tempWaypoints,
          token: localStorage.token,
          created_by: this.race.created_by
        })
        .then(response => {
          if (response.data.success) {
            this.$router.push({ name: 'Races' })
          }
        })
        .catch(error => {
          this.errorMessage = error.response.data.message
        })
      }
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
      this.tempWaypoints.push(this.address)
      this.clearAddress()
    },
    removeWaypoint: function (index) {
      this.tempWaypoints.splice(index, 1)
    }
  },
  mounted () {
    this.getRace()
  },
  created () {}
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
  width: 1000px;
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
.save .update {
  float: right;
}
.save .cancel {
  float: left;
}
</style>
