import { expect } from 'chai';
import { before } from 'mocha';
import { insertTestUser, initializeTestDb, getToken } from './helper/test.js';

const base_url = 'http://localhost:3001';

describe('GET Tasks', () => {
    before(async () => {
        await initializeTestDb(); // Initialize the test database
    });

    it('should get all tasks', async () => {
        const response = await fetch(base_url);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'description');
    });
});

describe('POST task', () => {
    const email = 'post@foo.com';
    const password = 'post123';
    let token;

    before(async () => {
        await insertTestUser(email, password);  // Insert test user
        token = getToken(email); // Generate token
    });

    it('should post a task', async () => {
        const response = await fetch(`${base_url}/create`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 'description': 'Task from unit test' })
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });

    it('should not post a task without a description', async () => {
        const response = await fetch(`${base_url}/create`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 'description': null })
        });
        const data = await response.json();

        expect(response.status).to.equal(500);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });
});

describe('DELETE task', () => {
    const email = 'delete@foo.com';
    const password = 'delete123';
    let token;

    before(async () => {
        await insertTestUser(email, password);  // Insert test user
        token = getToken(email); // Generate token
    });

    it('should delete a task', async () => {
        const response = await fetch(`${base_url}/delete/1`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });

    it('should not delete a task with SQL injection', async () => {
        const response = await fetch(`${base_url}/delete/id=0 or id > 0`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        expect(response.status).to.equal(500);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });
});

describe('POST register', () => {
    const email = 'register@foo.com';
    const password = 'register123';

    it('should register with valid email and password', async () => {
        const response = await fetch(`${base_url}/user/register`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();

        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email');
    });
});

describe('POST login', () => {
    const email = 'login@foo.com';
    const password = 'login123';

    before(async () => {
        await initializeTestDb();
        await insertTestUser(email, password);
    });

    it('should login with valid credentials', async () => {
        const response = await fetch(`${base_url}/user/login`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();

        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    });
});
