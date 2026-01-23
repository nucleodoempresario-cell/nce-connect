import { AdminLayout } from '@/components/layout/AdminLayout';
import ManageUsers from './admin/ManageUsers';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <ManageUsers />
    </AdminLayout>
  );
}
