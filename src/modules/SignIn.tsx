import React, { useState } from 'react';
import logo from '../images/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../components/AuthProvider';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        // Auth state will be handled by AuthProvider
        navigate('/my-kitchen');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sand">
      <div className="w-full max-w-sm">
        <div className="bg-maineBlue rounded-t-lg flex flex-col items-center justify-center py-6">
          <img src={logo} alt="PorkChop Logo" className="h-16 w-16 object-contain mb-2" />
        </div>
        <form onSubmit={handleSignIn} className="bg-white p-8 rounded-b-lg shadow max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-6 text-maineBlue">Sign In</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button 
          type="submit" 
          className="w-full bg-maineBlue text-seafoam py-2 rounded font-semibold hover:bg-seafoam hover:text-maineBlue transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-maineBlue underline">Sign Up</Link>
        </div>
      </form>
      </div>
    </div>
  );
};

export default SignIn;
