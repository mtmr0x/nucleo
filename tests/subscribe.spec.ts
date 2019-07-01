import subscribe, { listeners } from './../src/subscribe';

import { expect } from 'chai';
import 'mocha';

describe('Subscription functionality', () => {
  function listenA() {
    return false;
  }

  function listenB() {
    return false;
  }
  it('Should add functions to list of listeners', () => {
    subscribe(listenA);

    expect(listeners).to.have.length(1);
  });
  it('Should add listenB to list of listeners', () => {
    subscribe(listenB);
    expect(listeners).to.have.length(2);
  });
  it('Should add listenA to list of listeners and unsubscribe it', () => {
    const unsubscribe = subscribe(listenA);
    unsubscribe();
    expect(listeners).to.have.length(3);
    expect(listeners[0].on).to.equal(true);
    expect(listeners[1].on).to.equal(true);
    expect(listeners[2].on).to.equal(false);
  });
});

