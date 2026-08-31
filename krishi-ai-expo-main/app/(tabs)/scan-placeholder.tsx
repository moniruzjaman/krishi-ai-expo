// This tab is never actually rendered; the center FAB in _layout.tsx
// navigates directly to /analyzer via router.push
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
export default function ScanPlaceholder() {
  const router = useRouter();
  useEffect(() => { router.replace('/analyzer'); }, []);
  return null;
}
