import { ref } from 'vue';

type Donation = {
  id: string;
  email: string; // donor email
  amount: number;
  date: string; // ISO
  purpose?: string;
};

const donations = ref<Donation[]>([]);

function load() {
  try {
    const raw = localStorage.getItem('donations') || '[]';
    donations.value = JSON.parse(raw);
  } catch (e) {
    donations.value = [];
  }
}

function save() {
  localStorage.setItem('donations', JSON.stringify(donations.value));
}

export function listDonationsFor(email: string) {
  load();
  return donations.value.filter(d => d.email === email).sort((a,b) => +new Date(b.date) - +new Date(a.date));
}

export function addDonation(d: Omit<Donation,'id'>) {
  load();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  const entry = { ...d, id };
  donations.value.push(entry as Donation);
  save();
  return entry;
}

export default donations;
