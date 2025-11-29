import '@/i18n';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import TestVersionPopup from '@/components/TestVersionPopup';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <TestVersionPopup />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
