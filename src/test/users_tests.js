const users = require('../data/users');
const { expect } = require('chai');

describe('users', () => {
    it('devrait contenir un tableau', () => {
        expect(users).to.be.an('array');
    });

    it('devrait avoir des utilisateurs avec un id', () => {
        expect(users[0]).to.have.property('id');
    });

    it('devrait avoir des utilisateurs avec un nom', () => {
        expect(users[0]).to.have.property('name');
    });
    it('id 1 devrait être Alice Martin', () => {
        const user = users.find(u => u.id === 1);
        expect(user).to.exist;
        expect(user.name).to.equal('Alice Martin');
    });

    it('id 2 devrait être Bob Dupont', () => {
        const user = users.find(u => u.id === 2);
        expect(user).to.exist;
        expect(user.name).to.equal('Bob Dupont');
    });

    it('id 2 devrait être Bob Dupont', () => {
        const user = users.find(u => u.id === 2);
        expect(user).to.exist;
        expect(user.name).to.equal('Bob Dupont');
    });

    it('id 3 devrait être Charlie Leroy', () => {
        const user = users.find(u => u.id === 3);
        expect(user).to.exist;
        expect(user.name).to.equal('Charlie Leroy');
    });

    it('id 3 devrait avoir comme email charlie@example.com', () => {
        const user = users.find(u => u.id === 3);
        expect(user).to.exist;
        expect(user.email).to.equal('charlie@example.com');
    });

});