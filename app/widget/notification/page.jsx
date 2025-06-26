'use client';

import { useSearchParams } from 'next/navigation';

// widget/notification?width=1920&height=1080
export default function NotificationWidget() {
  const searchParams = useSearchParams();
  const width = searchParams.get('width');
  const height = searchParams.get('height');

  if (!width || !height) return null;

  return (
    <div style={{ width, height }}>
      Notification Widget
    </div>
  );
}
