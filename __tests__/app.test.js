const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');



const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
beforeEach(() => seed(testData))

afterAll(() => {
    if (db.end) db.end()
})

describe('1. GET api/:path', () => {

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

    test('status 200: responds with an array of objects with required properties', () => {
        return request(app)
        .get('/api/reviews ')
        .expect(200)
        .then(({body}) => {
        const {reviews} = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy('created_at', {descending: true})
    

        reviews.forEach((review) => {
            expect(review).toEqual(
                expect.objectContaining({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    designer: expect.any(String),
                    comment_count: expect.any(String)
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