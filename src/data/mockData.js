export const mockPatients = [
  { id: '1', name: 'Rahul Sharma', age: 45, gender: 'Male', phone: '+91 9876543210', lastVisit: '2026-04-15' },
  { id: '2', name: 'Priya Patel', age: 32, gender: 'Female', phone: '+91 9876543211', lastVisit: '2026-04-20' },
  { id: '3', name: 'Amit Kumar', age: 28, gender: 'Male', phone: '+91 9876543212', lastVisit: '2026-04-28' },
];

export const mockAppointments = [
  { id: '1', patientId: '1', patientName: 'Rahul Sharma', date: '2026-05-01', time: '10:00 AM', status: 'Scheduled', type: 'Follow-up' },
  { id: '2', patientId: '2', patientName: 'Priya Patel', date: '2026-05-01', time: '11:30 AM', status: 'Completed', type: 'Consultation' },
  { id: '3', patientId: '3', patientName: 'Amit Kumar', date: '2026-05-01', time: '02:00 PM', status: 'Scheduled', type: 'Checkup' },
];

export const mockInventory = [
  { id: '1', name: 'Paracetamol 500mg', stock: 150, unit: 'Tablets', status: 'In Stock' },
  { id: '2', name: 'Amoxicillin 250mg', stock: 20, unit: 'Capsules', status: 'Low Stock' },
  { id: '3', name: 'Cough Syrup', stock: 45, unit: 'Bottles', status: 'In Stock' },
];

export const mockInvoices = [
  { id: 'INV-101', patientName: 'Rahul Sharma', amount: 500, date: '2026-04-15', status: 'Paid' },
  { id: 'INV-102', patientName: 'Priya Patel', amount: 1200, date: '2026-04-20', status: 'Pending' },
];
