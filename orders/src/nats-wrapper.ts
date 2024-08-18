import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // The ? indicates that _client might be of type Stan, but it can also be undefined. 
  // This means that _client is not required to be initialized when the object is created.
  private _client?: Stan;

  // create a getter to expose the client to the outside world
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      // use getter to access the client
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', err => {
        reject(err);
      })
    })
  }
}

export const natsWrapper = new NatsWrapper();