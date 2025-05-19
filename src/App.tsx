import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import MyKitchen from './modules/MyKitchen';
import MyCookBook from './modules/MyCookBook';
import ChefsCorner from './modules/ChefsCorner';
import CulinarySchool from './modules/CulinarySchool';
import Profile from './components/Profile';
import SignUp from './modules/SignUp';
import SignIn from './modules/SignIn';
import { supabase } from './api/supabaseClient';
import Dashboard from './components/Dashboard';
import ChefFreddieWidget from './components/ChefFreddieWidget';
import { FreddieProvider } from './components/FreddieContext';
import { RecipeProvider } from './components/RecipeContext';

import { useEffect, useState } from 'react';

const App = () => {
  const location = useLocation();
  const hideChefFreddie = location.pathname === '/signup' || location.pathname === '/signin';
  const [isAuth, setIsAuth] = useState<boolean>(false);
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session);
    });
    // Check initial state
    supabase.auth.getSession().then(({ data }) => setIsAuth(!!data.session));
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  return (
    <RecipeProvider>
      <FreddieProvider>
        <div className="min-h-screen bg-sand">
          {location.pathname !== '/signin' && location.pathname !== '/signup' && <NavBar />}
          <main className="max-w-5xl mx-auto px-4 pt-8 pb-8">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              {/* Protected routes */}
              <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/signin" />} />
              <Route path="/my-kitchen" element={isAuth ? <MyKitchen /> : <Navigate to="/signin" />} />
              <Route path="/my-cookbook" element={isAuth ? <MyCookBook /> : <Navigate to="/signin" />} />
              <Route path="/chefs-corner" element={isAuth ? <ChefsCorner /> : <Navigate to="/signin" />} />
              <Route path="/culinary-school" element={isAuth ? <CulinarySchool /> : <Navigate to="/signin" />} />
              <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/signin" />} />
              <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/signin"} />} />
            </Routes>
          </main>
          {!hideChefFreddie && <ChefFreddieWidget />}
        </div>
      </FreddieProvider>
    </RecipeProvider>
  );
};

export default App;
