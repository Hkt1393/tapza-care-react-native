const assert = require('node:assert/strict');
const test = require('node:test');
const { createMockDataAccess } = require('../.test-build/src/services/mock/mockDataAccess.js');

const testNow = () => '2026-10-23T12:00:00+05:30';

const getFirstAvailableRequest = async (services, doctorId = 'doctor-ananya-rao') => {
  const [date] = await services.fetchAvailableDates(doctorId);
  const slots = await services.fetchSlots(doctorId, date);
  return { date, request: { doctorId, slotId: slots[0].id } };
};

test('booking a slot twice returns a typed 409 conflict on the second attempt', async () => {
  const services = createMockDataAccess({ now: testNow });
  const { request } = await getFirstAvailableRequest(services);
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
  services.configureNetwork({ emptyLists: { slots: true } });
  assert.deepEqual(await services.fetchAvailableDates('doctor-ananya-rao'), []);
  services.configureNetwork({ failures: { prescriptions: true } });
  await assert.rejects(services.fetchPrescriptions(), { name: 'MockRequestError' });
});

test('a successful booking removes its slot from the authoritative availability list', async () => {
  const services = createMockDataAccess({ now: testNow });
  const { date, request } = await getFirstAvailableRequest(services);

  const booking = await services.createBooking(request);
  const slots = await services.fetchSlots(request.doctorId, date);

  assert.equal(booking.slotId, request.slotId);
  assert.equal(slots.find((slot) => slot.id === request.slotId).available, false);
});

test('dates disappear from availability after all of their slots are booked', async () => {
  const services = createMockDataAccess({ now: testNow });
  const { date } = await getFirstAvailableRequest(services);
  const slots = await services.fetchSlots('doctor-ananya-rao', date);

  for (const slot of slots) {
    await services.createBooking({ doctorId: slot.doctorId, slotId: slot.id });
  }

  assert.ok(!(await services.fetchAvailableDates('doctor-ananya-rao')).includes(date));
});

test('a failed booking request leaves the slot available for retry', async () => {
  const services = createMockDataAccess({ now: testNow });
  const { date, request } = await getFirstAvailableRequest(services);
  services.configureNetwork({ failures: { bookings: true } });

  await assert.rejects(services.createBooking(request), { name: 'MockRequestError' });
  const afterFailure = await services.fetchSlots(request.doctorId, date);
  assert.equal(afterFailure.find((slot) => slot.id === request.slotId).available, true);

  services.configureNetwork({ failures: { bookings: false } });
  const retry = await services.createBooking(request);
  assert.equal(retry.status, 'confirmed');
});

test('concurrent attempts to reserve one slot produce one booking and one 409 conflict', async () => {
  const services = createMockDataAccess({ now: testNow });
  const { request } = await getFirstAvailableRequest(services);

  const results = await Promise.allSettled([
    services.createBooking(request),
    services.createBooking(request),
  ]);

  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  const rejected = results.find((result) => result.status === 'rejected');
  assert.equal(rejected.reason.name, 'BookingConflictError');
  assert.equal(rejected.reason.statusCode, 409);
});

test('offered booking dates all have slots and roll forward with mock time', async () => {
  let currentTime = testNow();
  const services = createMockDataAccess({ now: () => currentTime });
  const initialDates = await services.fetchAvailableDates('doctor-ananya-rao');

  assert.equal(initialDates.length, 7);
  for (const date of initialDates) {
    const slots = await services.fetchSlots('doctor-ananya-rao', date);
    assert.ok(slots.some((slot) => slot.available));
  }

  currentTime = '2026-10-24T12:00:00+05:30';
  const nextDates = await services.fetchAvailableDates('doctor-ananya-rao');
  assert.equal(nextDates.length, 7);
  assert.ok(!nextDates.includes(initialDates[0]));
  assert.ok(nextDates.at(-1) > initialDates.at(-1));
  const newlyOfferedSlots = await services.fetchSlots('doctor-ananya-rao', nextDates.at(-1));
  assert.ok(newlyOfferedSlots.some((slot) => slot.available));
});
