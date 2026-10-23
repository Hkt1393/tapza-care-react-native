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

test('a successful booking removes its slot from the authoritative availability list', async () => {
  const services = createMockDataAccess({ now: () => '2026-10-23T12:00:00.000Z' });
  const request = { doctorId: 'doctor-ananya-rao', slotId: 'slot-ananya-0900' };

  const booking = await services.createBooking(request);
  const slots = await services.fetchSlots(request.doctorId, '2026-10-24');

  assert.equal(booking.slotId, request.slotId);
  assert.equal(slots.find((slot) => slot.id === request.slotId).available, false);
});

test('a failed booking request leaves the slot available for retry', async () => {
  const services = createMockDataAccess();
  const request = { doctorId: 'doctor-ananya-rao', slotId: 'slot-ananya-0900' };
  services.configureNetwork({ failures: { bookings: true } });

  await assert.rejects(services.createBooking(request), { name: 'MockRequestError' });
  const afterFailure = await services.fetchSlots(request.doctorId, '2026-10-24');
  assert.equal(afterFailure.find((slot) => slot.id === request.slotId).available, true);

  services.configureNetwork({ failures: { bookings: false } });
  const retry = await services.createBooking(request);
  assert.equal(retry.status, 'confirmed');
});

test('concurrent attempts to reserve one slot produce one booking and one 409 conflict', async () => {
  const services = createMockDataAccess();
  const request = { doctorId: 'doctor-ananya-rao', slotId: 'slot-ananya-0900' };

  const results = await Promise.allSettled([
    services.createBooking(request),
    services.createBooking(request),
  ]);

  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  const rejected = results.find((result) => result.status === 'rejected');
  assert.equal(rejected.reason.name, 'BookingConflictError');
  assert.equal(rejected.reason.statusCode, 409);
});
