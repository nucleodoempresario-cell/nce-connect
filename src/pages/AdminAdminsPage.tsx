import { AdminLayout } from '@/components/layout/AdminLayout';
import ManageAdmins from './admin/ManageAdmins';

export default function AdminAdminsPage() {
  return (
    <AdminLayout>
      <ManageAdmins />
    </AdminLayout>
  );
}
