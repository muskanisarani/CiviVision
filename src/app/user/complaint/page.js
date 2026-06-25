import { Suspense } from 'react';
import UserComplaint from '../../../views/user/UserComplaint';

export default function Page() {
  return (
    <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8fafc', color: '#6366f1' }}>Loading...</div>}>
      <UserComplaint />
    </Suspense>
  );
}
