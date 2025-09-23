import request from 'supertest';

import { createApp } from '../src/app';

const { app } = createApp();

describe('Health Endpoint', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('timestamp');
    
    expect(typeof response.body.uptime).toBe('number');
    expect(typeof response.body.version).toBe('string');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/api/unknown-route')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('statusCode', 404);
    expect(response.body.error).toHaveProperty('message');
  });
});