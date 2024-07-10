import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/patient'); // Redirect to patient page on successful login
    } catch (error) {
      setError('Failed to sign in. Please check your email and password.');
      console.error('Failed to sign in:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="mt-2 text-sm text-gray-600">Please enter your email and password to login.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản? <br />
            <a href="/register" className="text-blue-600 hover:underline">Đăng kí khóa học Lục Khí Trung Cấp bậc 1</a> để nhận tài khoản. <br />
            Hoặc liên hệ <a href="/contact" className="text-blue-600 hover:underline">bác sĩ Vũ Đức Đại</a> để được cấp tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
