import { AdminLayout } from '@/components/layout/AdminLayout';
import ManageCompanies from './admin/ManageCompanies';

export default function AdminCompaniesPage() {
  return (
    <AdminLayout>
      <ManageCompanies />
    </AdminLayout>
  );
}
