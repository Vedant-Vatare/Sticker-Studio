import { lazy } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './components/pages/Home';
import ProductsCollection from './components/pages/ProductCollection';
import { Toaster } from '@/components/ui/sonner';
import { LoginModal } from './components/ui/modal/LoginModal';
const AuthHeader = lazy(() => import('./components/pages/auth/AuthHeader'));
const UserVerification = lazy(
  () => import('./components/pages/auth/UserVerification'),
);
const SetPassword = lazy(() => import('./components/pages/auth/SetupPassword'));
const Login = lazy(() => import('./components/pages/auth/Login'));
const Signup = lazy(() => import('./components/pages/auth/Signup'));
const Cart = lazy(() => import('./components/pages/Cart'));
const Checkout = lazy(() => import('./components/pages/Checkout'));
const Shop = lazy(() => import('./components/pages/Shop'));
const PageNotFound = lazy(() => import('./components/pages/PageNotFound'));
const ServerError = lazy(() => import('./components/pages/ServerError'));
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthHeader />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/verification" element={<UserVerification />} />
            <Route path="/auth/setup-password" element={<SetPassword />} />
          </Route>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />

            <Route path="/shop" element={<Shop />} />
            <Route path="/account" element={<>Account</>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/shop/:collectionSlug"
              element={<ProductsCollection />}
            />
            <Route path="/server-error" element={<ServerError />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <LoginModal />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
