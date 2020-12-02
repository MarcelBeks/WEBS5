const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('Sign Up API -> Sign up with unused username', function () {
    it('Should succeed if username not in use', function (done) {
        request(app)
            .post('/api/auth/signup')
            .send({ username: 'Karel', password: '123456' })
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(function (response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                assert.equal(response.body.success, true, 'username in use')
            })
            .end(done);
    });
});

describe('Sign Up API -> Sign up with used username', function () {
    it('Should succeed if username in use', function (done) {
        request(app)
            .post('/api/auth/signup')
            .send({ username: 'Karel', password: '123456' })
            .expect(409)
            .expect('Content-Type', /json/)
            .expect(function (response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                assert.equal(response.body.success, false, 'username not in use')
            })
            .end(done);
    });
});

describe('Login API -> Login with credentials that exist and are correct', function () {
    it('Should succeed if credentials are valid', function (done) {
        request(app)
            .post('/api/auth/login')
            .send({ username: 'Karel', password: '123456' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function (response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                assert.equal(response.body.success, true, 'credentials are invalid')
            })
            .end(done);
    });
});

describe('Login API -> Login with credentials that do not exist or are incorrect', function () {
    it('Should succeed if credentials are invalid', function (done) {
        request(app)
            .post('/api/auth/login')
            .send({ username: 'Karel', password: '1234567' })
            .expect(401)
            .expect('Content-Type', /json/)
            .expect(function (response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                assert.equal(response.body.success, false, 'credentials are valid')
            })
            .end(done);
    });
});