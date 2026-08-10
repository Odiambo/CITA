import '@/index.css';
import AppProviders from '@/app/providers';

export const metadata = {
  title: 'CITA',
  description: 'Centralized Intake & Tracking Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
