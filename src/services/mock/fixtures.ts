import type { Doctor, Prescription, Slot } from '../../types/domain';

export const doctorFixtures: readonly Doctor[] = [
  { id: 'doctor-ananya-rao', name: 'Dr. Ananya Rao', specialty: 'General Physician', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', feeInr: 600, languages: ['English', 'Telugu', 'Hindi'] },
  { id: 'doctor-arjun-reddy', name: 'Dr. Arjun Reddy', specialty: 'Cardiologist', photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', feeInr: 900, languages: ['English', 'Telugu'] },
  { id: 'doctor-meera-iyer', name: 'Dr. Meera Iyer', specialty: 'Pediatrician', photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', feeInr: 700, languages: ['English', 'Hindi'] },
];

const slotTimes: Readonly<Record<string, readonly [string, string]>> = {
  'doctor-ananya-rao': ['09:00', '09:30'],
  'doctor-arjun-reddy': ['10:00', '10:30'],
  'doctor-meera-iyer': ['11:00', '11:30'],
};

const clinicDateFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
});

const dateKey = (date: Date): string => {
  const parts = clinicDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  return `${year}-${month}-${day}`;
};

const addDays = (key: string, count: number): string => {
  const date = new Date(`${key}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
};

/** Creates a deterministic rolling week of clinic slots relative to mock time. */
export const createSlotFixtures = (referenceTime: string): Slot[] => {
  const referenceDate = new Date(referenceTime);
  const fixtures: Slot[] = [];

  for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
    const dayKey = addDays(dateKey(referenceDate), dayOffset);

    for (const [doctorId, times] of Object.entries(slotTimes)) {
      for (const time of times) {
        const startHour = Number(time.slice(0, 2));
        const startMinute = Number(time.slice(3, 5));
        const endMinute = startMinute + 20;
        const endHour = startHour + Math.floor(endMinute / 60);
        const endMinuteOfHour = String(endMinute % 60).padStart(2, '0');
        const startsAt = `${dayKey}T${time}:00+05:30`;
        const endsAt = `${dayKey}T${String(endHour).padStart(2, '0')}:${endMinuteOfHour}:00+05:30`;

        fixtures.push({
          id: `slot-${doctorId}-${dayKey}-${time.replace(':', '')}`,
          doctorId,
          startsAt,
          endsAt,
          available: true,
        });
      }
    }
  }

  return fixtures;
};

export const prescriptionFixtures: readonly Prescription[] = [
  {
    id: 'prescription-2026-10-20-001', issuedAt: '2026-10-20T11:30:00+05:30', doctorName: 'Dr. Ananya Rao',
    clinicName: 'Tapza Family Clinic, Jubilee Hills, Hyderabad',
    medicines: [
      { id: 'medicine-paracetamol', name: 'Paracetamol 500 mg', dose: '1 tablet after food', days: 3, timing: ['morning', 'night'] },
      { id: 'medicine-vitamin-d', name: 'Vitamin D3 60,000 IU', dose: '1 capsule after food', days: 4, timing: ['afternoon'] },
    ],
  },
  {
    id: 'prescription-2026-10-12-002', issuedAt: '2026-10-12T16:00:00+05:30', doctorName: 'Dr. Meera Iyer',
    clinicName: 'Tapza Family Clinic, Jubilee Hills, Hyderabad',
    medicines: [{ id: 'medicine-cetirizine', name: 'Cetirizine 10 mg', dose: '1 tablet at bedtime', days: 5, timing: ['night'] }],
  },
];
