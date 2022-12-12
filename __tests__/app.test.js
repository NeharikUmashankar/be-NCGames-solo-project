const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');



const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
beforeEach(() => seed(testData))

afterAll(() => {
    if (db.end) db.end()
})

describe('1. GET api/categories', () => {

    test('status 200: responds with an array of objects with properties of slug and description', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
           
        const {categories} = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);

        categories.forEach((category) => {
            
            expect(category).toEqual(
                expect.objectContaining({
                    slug: expect.any(String), 
                    description: expect.any(String)
                })
            )
        })
    })
    })
})


describe('ALL categories of undefined path', () => {

    test('status 404: catches error for non-existent path', () => {

        return request(app)
        .get('/api/categoriesss')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Path not found')
        })

    })
})