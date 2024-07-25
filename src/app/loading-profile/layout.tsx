import { Suspense } from 'react';

export default function SuspenseBoundaryWrapper({ children }) {
  return <Suspense>{children}</Suspense>;
}
