const assert = require('node:assert/strict');
const test = require('node:test');
const { createMockDataAccess } = require('../.test-build/src/services/mock/mockDataAccess.js');

const dose = {
  prescriptionId: 'prescription-2026-10-20-001',
  medicineId: 'medicine-paracetamol',
  timing: 'morning',
};

test('taking an individual scheduled dose persists through subsequent reads', async () => {
  const services = createMockDataAccess();

  const updated = await services.setDoseTakenState({ ...dose, taken: true });
  const readAgain = await services.fetchDoseTakenState(dose.prescriptionId);

  assert.equal(updated[`${dose.prescriptionId}::${dose.medicineId}::${dose.timing}`], true);
  assert.deepEqual(readAgain, updated);
});

test('a taken dose can be undone and its state is removed', async () => {
  const services = createMockDataAccess();
  await services.setDoseTakenState({ ...dose, taken: true });

  const undone = await services.setDoseTakenState({ ...dose, taken: false });

  assert.deepEqual(undone, {});
  assert.deepEqual(await services.fetchDoseTakenState(dose.prescriptionId), {});
});

test('dose state is isolated by prescription and reset with mock session state', async () => {
  const services = createMockDataAccess();
  await services.setDoseTakenState({ ...dose, taken: true });

  assert.deepEqual(await services.fetchDoseTakenState('prescription-2026-10-12-002'), {});
  services.reset();
  assert.deepEqual(await services.fetchDoseTakenState(dose.prescriptionId), {});
});

test('dose updates reject timings that are not prescribed', async () => {
  const services = createMockDataAccess();

  await assert.rejects(
    services.setDoseTakenState({ ...dose, timing: 'afternoon', taken: true }),
    { name: 'DoseTrackingError' },
  );
  assert.deepEqual(await services.fetchDoseTakenState(dose.prescriptionId), {});
});

test('a failed dose update leaves the previously saved status unchanged', async () => {
  const services = createMockDataAccess();
  await services.setDoseTakenState({ ...dose, taken: true });
  services.configureNetwork({ failures: { prescriptions: true } });

  await assert.rejects(services.setDoseTakenState({ ...dose, taken: false }), { name: 'MockRequestError' });
  services.configureNetwork({ failures: { prescriptions: false } });

  const current = await services.fetchDoseTakenState(dose.prescriptionId);
  assert.equal(current[`${dose.prescriptionId}::${dose.medicineId}::${dose.timing}`], true);
});
