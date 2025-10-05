import AdminLayout from '../../layouts/AdminLayout';
import Overview from './dashboard/Overview';

export default function AdminHome() {
  return (
    <AdminLayout>
      <Overview />
    </AdminLayout>
  );
}