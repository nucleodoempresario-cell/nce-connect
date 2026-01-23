import { AdminLayout } from '@/components/layout/AdminLayout';
import ViewApplications from './admin/ViewApplications';

export default function AdminApplicationsPage() {
  return (
    <AdminLayout>
      <ViewApplications />
    </AdminLayout>
  );
}
