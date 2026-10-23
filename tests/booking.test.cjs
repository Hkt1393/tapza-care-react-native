const assert = require('node:assert/strict');
const test = require('node:test');
const { createMockDataAccess } = require('../.test-build/src/services/mock/mockDataAccess.js');

test('booking a slot twice returns a typed 409 conflict on the second attempt', async () => {
  const services = createMockDataAccess({ now: () => '2026-10-23T12:00:00.000Z' });
  const request = { doctorId: 'doctor-ananya-rao', slotId: 'slot-ananya-0900' };
  const booking = await services.createBooking(request);
  assert.equal(booking.status, 'confirmed');
  await assert.rejects(services.createBooking(request), (error) => {
    assert.equal(error.name, 'BookingConflictError');
    assert.equal(error.statusCode, 409);
    return true;
  });
});

test('network controls simulate latency, failure, and empty list responses', async () => {
  const services = createMockDataAccess();
  services.configureNetwork({ emptyLists: { doctors: true } });
  assert.deepEqual(await services.fetchDoctors(), []);
  services.configureNetwork({ failures: { prescriptions: true } });
  await assert.rejects(services.fetchPrescriptions(), { name: 'MockRequestError' });
});
