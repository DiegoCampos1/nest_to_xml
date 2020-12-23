interface ApiStatus {
  status: 'pass' | 'fail' | 'warn';
  notes?: string[];
  description?: string;
}
