import AdminLayout from '../../layouts/AdminLayout';
import Overview from './dashboard/Overview';

export default function Dashboard() {
  return (
    <AdminLayout>
      <Overview />
    </AdminLayout>
  );
}