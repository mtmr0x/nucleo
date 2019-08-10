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
    const length = listeners.length + 1;
    subscribe(listenA);

    expect(listeners).to.have.length(length);
  });
  it('Should add listenB to list of listeners', () => {
    const length = listeners.length + 1;
    subscribe(listenB);
    expect(listeners).to.have.length(length);
  });
  it('Should add listenA to list of listeners and unsubscribe it', () => {
    const length = listeners.length + 1;
    const unsubscribe = subscribe(listenA);
    unsubscribe();
    expect(listeners).to.have.length(length);
    expect(listeners[length - 1].on).to.equal(false);
  });
});

