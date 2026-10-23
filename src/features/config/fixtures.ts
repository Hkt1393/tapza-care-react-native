import type { LayoutConfig } from '../../types/domain';
import { validateLayoutConfig } from './validateConfig';

const sharedTabs = [
  { id: 'home', label: 'Home', icon: 'home', screen: 'home' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar', screen: 'bookings' },
  { id: 'prescriptions', label: 'Prescriptions', icon: 'clipboard', screen: 'prescriptions' },
  { id: 'profile', label: 'Profile', icon: 'person', screen: 'profile' },
] as const;

const normalDayPayload: unknown = {
  version: 1,
  theme: {
    primary: '#146C62', secondary: '#164E63', background: '#F3F8F6', surface: '#FFFFFF',
    textPrimary: '#153632', textSecondary: '#526B66', accent: '#E7A84B',
  },
  tabs: sharedTabs,
  sections: [
    { id: 'hero', type: 'hero_banner', background: { kind: 'gradient', value: '#146C62,#164E63' }, title: 'Care that fits your day', items: [{ greeting: 'Good morning', subtitle: 'Your family’s care, all in one place' }] },
    { id: 'categories', type: 'category_chips', background: { kind: 'color', value: '#F3F8F6' }, title: 'Explore care', items: [{ id: 'consult', label: 'Consult' }, { id: 'tests', label: 'Lab tests' }, { id: 'pharmacy', label: 'Pharmacy' }, { id: 'vaccines', label: 'Vaccines' }] },
    { id: 'quick-actions', type: 'quick_actions', background: { kind: 'color', value: '#FFFFFF' }, title: 'Quick actions', items: [{ id: 'book', label: 'Book a doctor' }, { id: 'prescriptions', label: 'Prescriptions' }, { id: 'reminders', label: 'Reminders' }, { id: 'family', label: 'Family' }] },
    { id: 'services', type: 'service_grid', background: { kind: 'color', value: '#F3F8F6' }, title: 'Popular services', items: [{ id: 'home-test', name: 'Home blood test', imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600', priceInr: 499, badge: 'Popular' }, { id: 'health-check', name: 'Health check-up', imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600', priceInr: 1299 }] },
    {
      id: 'doctors', type: 'doctor_carousel', background: { kind: 'color', value: '#FFFFFF' }, title: 'Doctors near you',
      items: [
        { id: 'doctor-ananya-rao', name: 'Dr. Ananya Rao', specialty: 'General Physician', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', feeInr: 600, nextAvailableAt: 'Today, 9:00 AM' },
        { id: 'doctor-arjun-reddy', name: 'Dr. Arjun Reddy', specialty: 'Cardiologist', photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', feeInr: 900, nextAvailableAt: 'Today, 10:30 AM' },
      ],
    },
    { id: 'offer', type: 'offer_strip', background: { kind: 'gradient', value: '#E7A84B,#F6D69B' }, items: [{ message: 'Your first home collection is ₹100 off' }] },
  ],
};

const diwaliPayload: unknown = {
  version: 1,
  theme: {
    primary: '#7A3E18', secondary: '#5B2B53', background: '#FFF8ED', surface: '#FFFFFF',
    textPrimary: '#3E291D', textSecondary: '#715846', accent: '#C78A24',
    festival: {
      name: 'Diwali', greeting: 'A bright and healthy Diwali',
      bannerImageUrl: 'https://images.unsplash.com/photo-1604608672516-5e5e4f6f8fc5?w=1200',
    },
  },
  tabs: sharedTabs,
  sections: [
    { id: 'diwali-hero', type: 'hero_banner', background: { kind: 'image', value: 'https://images.unsplash.com/photo-1604608672516-5e5e4f6f8fc5?w=1200' }, title: 'Celebrate a healthier Diwali', items: [{ greeting: 'Happy Diwali', subtitle: 'A little care is a lovely gift' }] },
    { id: 'diwali-offer', type: 'offer_strip', background: { kind: 'gradient', value: '#C78A24,#F1D398' }, items: [{ message: 'Festival health checks from ₹799' }] },
    { id: 'diwali-actions', type: 'quick_actions', background: { kind: 'color', value: '#FFF8ED' }, title: 'Care for every celebration', items: [{ id: 'book', label: 'Book a doctor' }, { id: 'prescriptions', label: 'Prescriptions' }, { id: 'reminders', label: 'Reminders' }, { id: 'family', label: 'Family' }] },
    {
      id: 'diwali-doctors', type: 'doctor_carousel', background: { kind: 'color', value: '#FFFFFF' }, title: 'Talk to a doctor',
      items: [
        { id: 'doctor-ananya-rao', name: 'Dr. Ananya Rao', specialty: 'General Physician', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', feeInr: 600, nextAvailableAt: 'Today, 9:00 AM' },
        { id: 'doctor-meera-iyer', name: 'Dr. Meera Iyer', specialty: 'Pediatrician', photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', feeInr: 700, nextAvailableAt: 'Today, 11:00 AM' },
      ],
    },
    { id: 'diwali-services', type: 'service_grid', background: { kind: 'color', value: '#FFF8ED' }, title: 'Festival wellness', items: [{ id: 'festive-check', name: 'Festive wellness check', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600', priceInr: 799, badge: 'Festival offer' }] },
    { id: 'diwali-categories', type: 'category_chips', background: { kind: 'color', value: '#FFFFFF' }, title: 'Explore care', items: [{ id: 'consult', label: 'Consult' }, { id: 'tests', label: 'Lab tests' }, { id: 'pharmacy', label: 'Pharmacy' }, { id: 'vaccines', label: 'Vaccines' }] },
  ],
};

export const normalDayConfig: LayoutConfig = validateLayoutConfig(normalDayPayload);
export const diwaliConfig: LayoutConfig = validateLayoutConfig(diwaliPayload);

export const configFixtures: Readonly<Record<'normal' | 'diwali', LayoutConfig>> = {
  normal: normalDayConfig,
  diwali: diwaliConfig,
};
