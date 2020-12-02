<template>
  <div class="racesPage">
    <div class="header">
      <h1>Races</h1>
      <router-link v-bind:to="{ name: 'NewRace' }"><button class="btn btn-primary">Add Race</button></router-link>
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
    </div>
    <table class="table">
      <tr>
        <th width="70%">Races</th>
        <th width="10%" style="text-align: center;">Edit</th>
        <th width="10%" style="text-align: center;">Start</th>
        <th width="10%" style="text-align: center;">Progress</th>
      </tr>
      <tr v-for="(race, index) in races" :key="race._id">
        <td v-text="race.title"></td>
        <td style="text-align: center;">
          <router-link v-bind:to="{ name: 'EditRace', params: {race: race._id, created_by: race.created_by.username }}">
            <i 
              v-if="race.created_by.username === user.username || user.role === 'admin'" 
              class="fa fa-edit">
            </i>
          </router-link>
        </td>
        <td style="text-align: center;">
          <i 
            @click="startRace(race, index)" v-if="(race.created_by.username === user.username && race.started === false) || (user.role === 'admin' && race.started === false)"
            class="fa fa-play-circle text-success">
          </i>
        </td>
        <td style="text-align: center;">
          <router-link v-bind:to="{ name: 'ProgressRace', params: {id: race._id }}">
            <i v-if="race.started === true" class="fa fa-tasks text-secondary"></i>
          </router-link>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import RaceService from "../services/RaceService";
import io from 'socket.io-client'

export default {
  name: "Races",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      races: [],
      error: "",
      socket: io.connect(),
      errorMessage: ''
    };
  },
  methods: {
    async startRace (race, index) {
      await RaceService.startRace({
        id: race._id,
        token: localStorage.token,
        created_by: race.created_by
      })
      .then(response => {
        if (response.data.success) {
          this.socket.emit('RACE_STARTED', {
            index: index
          })
          this.createStartedRace(race)
        }
      })
      .catch(error => {
        this.errorMessage = error.response.data.message
      })
    },

    async createStartedRace (race) {
      await RaceService.createStartedRace({
        race: race
      })
      .then(response => {
        if (response.data.success === true) {
          this.$router.push({ name: 'ProgressRace', params: { id: race._id } })
        }
      })
      .catch(error => {
        this.errorMessage = error.response.data.message
      })
    },
  },
  mounted () {
    this.socket.on('RACE', (data) => {
      this.races.push(data.race)
    })
    this.socket.on('RACE_START', (index) => {
      this.races[index].started = true
    })
  },
  async created() {
    try {
      this.races = await RaceService.getRaces();
    } catch (err) {
      this.error = err.message;
    }
  }
};
</script>

<style scoped>
.racesPage {
  width: 100%;
}
.header {
  text-align: center;
  color: #2F4454
}
.table {
  width: 60%;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
}
.table td,
.table th {
  border: 1px solid gray;
  padding: 8px;
}
.table tr:nth-child(even) {
  background-color: #f2f2f2;
}
.table td:not(:first-child) i {
  cursor: pointer;
}

.table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0d172e;
  color: white;
}
</style>
