import axios from 'axios'

const url = '/api/races/'
const config = {
    headers: {'Authorization': "Bearer " + localStorage.token}
}

class RaceService {
    // Get Races
    static getRaces() {
        const urlquery = new URLSearchParams(window.location.search)
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + '?' + urlquery)
                const races = res.data
                resolve(races)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Get Race
    static getRace(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + params.id)
                const race = res.data
                resolve(race)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Create Race
    static addRace(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url, params, config)
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Update Race
    static updateRace(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.put(url + params.id, params, config)
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Start Race
    static startRace(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.put(url + 'start/' + params.id, params, config)
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Create Started Race
    static createStartedRace(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url + 'start/', params, config)
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Get Started Race
    static getStartedRace(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + 'started/' + params.id)
                const race = res.data
                resolve(race)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Check in
    static checkIn(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.put(url + 'checkin/' + params.id, params, config)
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }
}

export default RaceService