import axios from 'axios'

const url = '/api/auth/'

class AuthService {
    // Create User
    static addUser(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url + 'signup/', params)
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Log in
    static Login(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url + 'login/', params)
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }

    // Get Logged in user
    static getLoggedInUser(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + params.token)
                const user = res.data
                resolve(user)
            } catch (err) {
                reject(err)
            }
        })
    }
}

export default AuthService