import { AdminLayout } from '@/components/layout/AdminLayout';
import ManageNews from './admin/ManageNews';

export default function AdminNewsPage() {
  return (
    <AdminLayout>
      <ManageNews />
    </AdminLayout>
  );
}
