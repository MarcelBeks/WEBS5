<template>
  <div class="races">
    <div class="header">
      <h1>Race Progress</h1>
      <h2 v-text="race.title"></h2>
      <router-link v-bind:to="{ name: 'Races' }"><button class="btn btn-primary">Back</button></router-link>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>
    </div>
    <table class="table">
      <tr>
        <th width="90%">Waypoint</th>
        <th width="10%" style="text-align: center;">Check in</th>
      </tr>
      <tr v-for="(waypoint, index) in race.waypoints" :key="index">
          <td style="text-align: left;" v-text="waypoint.name"></td>
          <td><i @click="checkIn(index)" v-if="notCheckedIn(index)" class="fa fa-check-square text-success"></i></td>
      </tr>
    </table>
    <div v-if="allCheckIns.length">
      <table class="table">
        <tr>
          <th width="90%">Check-ins</th>
        </tr>
        <tr v-for="(checkIn, index) in allCheckIns" :key="index">
            <td style="text-align: left;" v-text="checkIn"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import RaceService from '@/services/RaceService'
import io from 'socket.io-client'

export default {
  name: 'ProgressRace',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      race: {},
      socket: io.connect(),
      allCheckIns: [],
      errorMessage: ''
    }
  },
  methods: {
    async getRace () {
      const response = await RaceService.getStartedRace({
        id: this.$route.params.id
      })
      this.race = response.race
      this.fillCheckInLog()
    },
    async checkIn (index) {
      this.race.waypoints[index].check_ins.push({
        id: this.user._id,
        username: this.user.username
      })
      await RaceService.checkIn({
        id: this.race._id,
        user: {
          _id: this.user._id,
          username: this.user.username
        },
        waypoint: index
      })
      .then(response => {
        if (response.data.success) {
          this.socket.emit('CHECKED_IN', {
            waypoint: this.race.waypoints[index].name,
            username: this.user.username
          })
        }
      })
      .catch(error => {
        this.errorMessage = error.response.data.message
      })
    },
    notCheckedIn: function (index) {
      for (var i = 0; i < this.race.waypoints[index].check_ins.length; i++) {
        if (this.race.waypoints[index].check_ins[i].username === this.user.username) {
          return false
        }
      }
      return true
    },
    fillCheckInLog: function () {
      for (let i = 0; i < this.race.waypoints.length; i++) {
        if (this.race.waypoints[i].check_ins) {
          for (let x = 0; x < this.race.waypoints[i].check_ins.length; x++) {
            this.allCheckIns.push(this.race.waypoints[i].check_ins[x].username + ' has checked in at ' + this.race.waypoints[i].name)
          }
        }
      }
    }
  },
  mounted () {
    this.socket.on('CHECK_IN', (data) => {
      this.allCheckIns.push(data.username + ' has checked in at ' + data.waypoint)
    })
  },
  created () {
    this.getRace()
  }
}
</script>
<style type="text/css" scoped>
.header {
  text-align: center;
}
.races {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
.table {
  width: 80%;
  margin-top: 50px;
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
</style>
