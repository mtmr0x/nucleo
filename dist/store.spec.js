"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const chai_1 = require("chai");
require("mocha");
describe('createState function', () => {
    it('should create and persist state', () => {
        const model = {
            alpha: 'Alpha',
            delta: 'Delta'
        };
        store_1.createState('example', model);
        const state = store_1.getState();
        console.log(state);
        chai_1.expect(JSON.stringify({ example: model })).to.equal(JSON.stringify(state));
    });
});
//# sourceMappingURL=store.spec.js.map