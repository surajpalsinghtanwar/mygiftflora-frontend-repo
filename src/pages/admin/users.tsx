import AdminLayout from '../../layouts/AdminLayout';
import UsersList from './users/UsersList';

export default function Users() {
  return (
    <AdminLayout>
      <UsersList />
    </AdminLayout>
  );
}