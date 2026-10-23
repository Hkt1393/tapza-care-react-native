import type { Doctor, Prescription, Slot } from '../../types/domain';

export const doctorFixtures: readonly Doctor[] = [
  { id: 'doctor-ananya-rao', name: 'Dr. Ananya Rao', specialty: 'General Physician', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', feeInr: 600, languages: ['English', 'Telugu', 'Hindi'] },
  { id: 'doctor-arjun-reddy', name: 'Dr. Arjun Reddy', specialty: 'Cardiologist', photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', feeInr: 900, languages: ['English', 'Telugu'] },
  { id: 'doctor-meera-iyer', name: 'Dr. Meera Iyer', specialty: 'Pediatrician', photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', feeInr: 700, languages: ['English', 'Hindi'] },
];

export const slotFixtures: readonly Slot[] = [
  { id: 'slot-ananya-0900', doctorId: 'doctor-ananya-rao', startsAt: '2026-10-24T09:00:00+05:30', endsAt: '2026-10-24T09:20:00+05:30', available: true },
  { id: 'slot-ananya-0930', doctorId: 'doctor-ananya-rao', startsAt: '2026-10-24T09:30:00+05:30', endsAt: '2026-10-24T09:50:00+05:30', available: true },
  { id: 'slot-arjun-1030', doctorId: 'doctor-arjun-reddy', startsAt: '2026-10-24T10:30:00+05:30', endsAt: '2026-10-24T10:50:00+05:30', available: true },
  { id: 'slot-meera-1100', doctorId: 'doctor-meera-iyer', startsAt: '2026-10-24T11:00:00+05:30', endsAt: '2026-10-24T11:20:00+05:30', available: true },
  { id: 'slot-ananya-251000', doctorId: 'doctor-ananya-rao', startsAt: '2026-10-25T10:00:00+05:30', endsAt: '2026-10-25T10:20:00+05:30', available: true },
  { id: 'slot-arjun-250900', doctorId: 'doctor-arjun-reddy', startsAt: '2026-10-25T09:00:00+05:30', endsAt: '2026-10-25T09:20:00+05:30', available: true },
  { id: 'slot-meera-251300', doctorId: 'doctor-meera-iyer', startsAt: '2026-10-25T13:00:00+05:30', endsAt: '2026-10-25T13:20:00+05:30', available: true },
  { id: 'slot-ananya-260930', doctorId: 'doctor-ananya-rao', startsAt: '2026-10-26T09:30:00+05:30', endsAt: '2026-10-26T09:50:00+05:30', available: true },
  { id: 'slot-arjun-261100', doctorId: 'doctor-arjun-reddy', startsAt: '2026-10-26T11:00:00+05:30', endsAt: '2026-10-26T11:20:00+05:30', available: true },
  { id: 'slot-meera-261000', doctorId: 'doctor-meera-iyer', startsAt: '2026-10-26T10:00:00+05:30', endsAt: '2026-10-26T10:20:00+05:30', available: true },
];

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
