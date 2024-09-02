import supertest from "supertest"
import { app } from '../src/app'
import { logger } from "../src/config/logging"
import { UserTest } from './test-util'

describe('POST /api/users', () => {

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should reject register new user if request invalid', async () => {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should register new user', async () => {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'test',
                name: 'test'
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe('test')
        expect(response.body.data.name).toBe('test')
    })
})

describe('POST /api/users/login', () => {
    beforeEach(async ()=> {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to login', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'test'
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe('test')
        expect(response.body.data.name).toBe('test')
        expect(response.body.data.token).toBeDefined()
    })

    it('should reject login if username is wrong', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: 'salah',
                password: 'test'
            })

        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject login if password is wrong', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'salah'
            })

        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/users/current', () => {
    beforeEach(async ()=> {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to get user', async () => {
        const response = await supertest(app)
            .get('/api/users/current')
            .set('X-API-TOKEN', 'test')

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe('test')
        expect(response.body.data.name).toBe('test')
    })

    it('should reject to get user', async () => {
        const response = await supertest(app)
            .get('/api/users/current')
            .set('X-API-TOKEN', 'salah')

        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCh /api/users/current', () => {
    beforeEach(async ()=> {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should reject update user if input invalid', async () => {
        const response = await supertest(app)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'test')
            .send({
                password: '',
                name: ''
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should accept update user if input valid', async () => {
        const response = await supertest(app)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'test')
            .send({
                password: 'benar',
                name: 'benar'
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
    })
})