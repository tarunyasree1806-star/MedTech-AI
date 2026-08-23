import React, { useState } from 'react';
import type { Doctor } from '../types';
import { Stethoscope, KeyRound, User, UserPlus, LogIn, CheckCircle2, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface LoginProps {
  doctors: Doctor[];
  onLogin: (doctor: Doctor) => void;
  onSignUp: (newDoctor: Doctor) => void;
}

export const Login: React.FC<LoginProps> = ({ doctors, onLogin, onSignUp }) => {
  const [isSignInMode, setIsSignInMode] = useState(true);

  // Sign In state
  const [username, setUsername] = useState('Kavisika');
  const [password, setPassword] = useState('Kavisika@123');
  const [signInError, setSignInError] = useState('');

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpHospital, setSignUpHospital] = useState('General Orthopedics Clinic');
  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState('');
  const [signUpErrorMsg, setSignUpErrorMsg] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    const foundDoctor = doctors.find(
      (d) => d.username.toLowerCase() === username.trim().toLowerCase() && d.password === password
    );

    if (foundDoctor) {
      onLogin(foundDoctor);
    } else {
      setSignInError('Invalid credentials. Please verify your Doctor Username and Password.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpErrorMsg('');
    setSignUpSuccessMsg('');

    if (!signUpName.trim() || !signUpUsername.trim() || !signUpPassword) {
      setSignUpErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    const exists = doctors.some((d) => d.username.toLowerCase() === signUpUsername.trim().toLowerCase());
    if (exists) {
      setSignUpErrorMsg('Username already registered. Please sign in or choose another username.');
      return;
    }

    const newDoctor: Doctor = {
      id: `doc-${Date.now()}`,
      name: signUpName.startsWith('Dr.') ? signUpName.trim() : `Dr. ${signUpName.trim()}`,
      username: signUpUsername.trim(),
      password: signUpPassword,
      role: 'Orthopedic Consultant',
      hospital: signUpHospital.trim() || 'MediTech Orthopedics Department',
    };

    onSignUp(newDoctor);
    setSignUpSuccessMsg('Account created successfully! You can now log in.');
    setIsSignInMode(true);
    setUsername(newDoctor.username);
    setPassword(newDoctor.password);
  };

  const autofillDoctor = (docUsername: string, docPass: string) => {
    setUsername(docUsername);
    setPassword(docPass);
    setSignInError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorator Elements - White and Blue aesthetic */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-blue-950/5 border border-blue-100 overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* Left Branding Side - Pure Blue Gradient Accent */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-700 via-blue-600 to-sky-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/20 mb-6">
              <ShieldCheck className="w-4 h-4 text-sky-200" /> Clinical Diagnostic Portal
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">MediTech OA</h1>
            </div>
            
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Osteoarthritis Prediction & Knee Implant Size Intelligence Powered by Deep Neural Segmentation.
            </p>
          </div>

          {/* Quick Doctor Account Selector Banner */}
          <div className="relative z-10 space-y-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
            <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" /> Preserved Doctor Login Profiles
            </p>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => autofillDoctor('Kavisika', 'Kavisika@123')}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                  username === 'Kavisika'
                    ? 'bg-white text-blue-900 font-semibold border-white shadow-sm'
                    : 'bg-blue-800/40 text-blue-100 border-white/10 hover:bg-white/15'
                }`}
              >
                <div>
                  <div className="font-medium">1) Dr. Kavisika</div>
                  <div className="text-[11px] opacity-80">Pass: Kavisika@123</div>
                </div>
                <span className="text-[10px] bg-sky-500/30 text-sky-100 px-2 py-0.5 rounded border border-sky-300/30">Auto-fill</span>
              </button>

              <button
                type="button"
                onClick={() => autofillDoctor('Harichandran', 'Hari@123')}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                  username === 'Harichandran'
                    ? 'bg-white text-blue-900 font-semibold border-white shadow-sm'
                    : 'bg-blue-800/40 text-blue-100 border-white/10 hover:bg-white/15'
                }`}
              >
                <div>
                  <div className="font-medium">2) Dr. Harichandran</div>
                  <div className="text-[11px] opacity-80">Pass: Hari@123</div>
                </div>
                <span className="text-[10px] bg-sky-500/30 text-sky-100 px-2 py-0.5 rounded border border-sky-300/30">Auto-fill</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[11px] text-blue-200 border-t border-white/10 flex justify-between items-center">
            <span>HIPAA Compliant Protocol</span>
            <span>v2.4 Pro</span>
          </div>
        </div>

        {/* Right Form Side - Clean White Theme */}
        <div className="md:w-7/12 p-8 flex flex-col justify-center">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsSignInMode(true);
                setSignInError('');
                setSignUpErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                isSignInMode
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" /> Doctor Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignInMode(false);
                setSignInError('');
                setSignUpErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                !isSignInMode
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Doctor Register (Sign Up)
            </button>
          </div>

          {signUpSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{signUpSuccessMsg}</span>
            </div>
          )}

          {isSignInMode ? (
            /* SIGN IN FORM */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Welcome Back, Doctor</h2>
                <p className="text-xs text-slate-500">Sign in to access patient OA analysis & implant recommendations.</p>
              </div>

              {signInError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                  {signInError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Doctor Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Kavisika or Harichandran"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Secure Doctor Sign In
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Default Logins:{' '}
                  <span className="font-semibold text-blue-600">Kavisika (Kavisika@123)</span> or{' '}
                  <span className="font-semibold text-blue-600">Harichandran (Hari@123)</span>
                </p>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Create Doctor Profile</h2>
                <p className="text-xs text-slate-500">Register new medical practitioner account for the platform.</p>
              </div>

              {signUpErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                  {signUpErrorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Doctor Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Dr. Aravind Swamy"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    placeholder="e.g. Aravind"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      value={signUpHospital}
                      onChange={(e) => setSignUpHospital(e.target.value)}
                      placeholder="Hospital Name"
                      className="w-full pl-8 pr-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Create Doctor Account
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
