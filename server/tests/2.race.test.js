const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const assert = require('chai').assert;

const mongoose = require('mongoose');
Race = mongoose.model('Race');

const jwt = require('jsonwebtoken')

const token = jwt.sign(
    {
        username: 'Karel',
        role: 'user',
        loggedIn: true
    },
    'THIS_IS_THE_SECRET_KEY_123_456_789',
    {
        expiresIn: '365d'
    }
)

// Race used for tests
const race = new Race({
    _id: new mongoose.Types.ObjectId(),
    title: 'Race for testing',
    waypoints: [
        {
            street_number: '83',
            route: 'Sluitappel',
            locality: 'Sint-Oedenrode',
            administrative_area_level_1: 'NB',
            country: 'Nederland',
            postal_code: '5491 TS',
            latitude: 51.56975380000001,
            longitude: 5.475979999999936,
            name: 'Meierij Accountancy & Advies B.V., Sluitappel, Sint-Oedenrode, Nederland'
        },
        {
            street_number: '25',
            route: 'Hoogstraat',
            locality: 'Veghel',
            administrative_area_level_1: 'NB',
            country: 'Nederland',
            postal_code: '5462 CW',
            latitude: 51.6155212,
            longitude: 5.538845600000059,
            name: 'Meierijstad Makelaardij, Hoogstraat, Veghel, Nederland'
        }
    ],
    created_by: {
        username: 'Karel'
    },
    started: false
})

describe('Race API -> Create a race with name that is unique', function () {
    it('Should succeed if race created successfully', function (done) {
        request(app)
            .post('/api/races/')
            .set('Authorization', "Bearer " + token)
            .send(race)
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(function (response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                assert.equal(response.body.success, true, 'race was not created successfully')
            })
            .end(done);
    });
});

describe('Race API -> Create a race with name that is not unique', function () {
    it('Should succeed if race created unsuccessfully', function (done) {
        request(app)
            .post('/api/races/')
            .set('Authorization', "Bearer " + token)
            .send(race)
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(function (response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                assert.equal(response.body.success, false, 'race was created successfully')
            })
            .end(done);
    });
});