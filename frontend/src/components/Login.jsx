import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthError, createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [inputFocus, setInputFocus] = useState(null);
    const navigate = useNavigate();



    async function signInWithEmail() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (!error) {
                navigate("/account", { state: { userData: data } });
            } else {
                setError(error);
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function signUpNewUser() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (!error) {
                navigate("/account", { state: { userData: data } });
            } else {
                setError(error);
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Background gradient with slight animation */}
            <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-white to-secondary/10 z-0"></div>


            {/* Custom cursor trail effect if we wanted to get fancy */}
            <style >{`
             
                
                .input-focus-effect {
                    transition: all 0.3s ease;
                }
                
                .password-strength-0 { background: linear-gradient(90deg, #ff4d4d 0%, #ededed 0%); }
                .password-strength-1 { background: linear-gradient(90deg, #ff4d4d 33%, #ededed 33%); }
                .password-strength-2 { background: linear-gradient(90deg, #ffba49 67%, #ededed 67%); }
                .password-strength-3 { background: linear-gradient(90deg, #48bb78 100%, #ededed 100%); }
            `}</style>

            <div className="flex min-h-screen relative z-10">
                {/* Left panel - Asymmetrical design with angled content */}
                <div className="hidden lg:block lg:w-1/2 relative bg-white/30 backdrop-blur-lg overflow-hidden">
                    <div
                        className="absolute inset-0 bg-primary/90 transform -skew-x-6 origin-top-right"
                        style={{
                            transition: 'transform 0.6s ease-out'
                        }}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center justify-center p-12">
                        <div
                            className="max-w-md text-white"
                            style={{
                                transition: 'transform 0.6s ease-out'
                            }}
                        >
                            <h1 className="text-5xl font-bold mb-8 tracking-tight leading-none">
                                Control<br/>
                                <span className="text-6xl relative inline-block">
                                    Center
                                    <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-secondary"></span>
                                </span>
                            </h1>

                            <p className="text-xl opacity-90 mb-6 leading-relaxed">
                                Manage your e-commerce empire with intuitive tools built for maximum efficiency.
                            </p>

                            <div className="mt-12 space-y-4">
                                <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">Product management with real-time inventory</p>
                                </div>

                                <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">Advanced analytics and trend forecasting</p>
                                </div>

                                <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">Comprehensive customer data and insights</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel - Login form with innovative design */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
                    <div
                        className="w-full max-w-md"

                    >
                        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-secondary/10"></div>
                            <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-primary/10"></div>

                            <div className="relative z-10">
                                <div className="flex justify-start mb-8">
                                    <div className="w-16 h-4 bg-primary rounded-r-full"></div>
                                    <div className="w-4 h-4 bg-secondary rounded-full -ml-2"></div>
                                </div>

                                <h2 className="text-3xl font-bold text-gray-800 mb-1">
                                    {isLogin ? 'Welcome back' : 'Join us'}
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    {isLogin
                                        ? 'Access your admin workspace'
                                        : 'Create your administrator account'}
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md animate-slide-in">
                                        <div className="flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-red-600">{error.message}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    if (isLogin) {
                                        signInWithEmail();
                                    } else {
                                        signUpNewUser();
                                    }
                                }}>
                                    <div className="space-y-5">
                                        <div
                                            className={`relative ${inputFocus === 'email' ? 'transform scale-105 transition-transform' : 'transition-transform'}`}
                                        >
                                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${inputFocus === 'email' ? 'text-primary' : 'text-gray-400'}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="email-address"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    className={`input-focus-effect block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${inputFocus === 'email' ? 'bg-primary/5' : 'bg-white'}`}
                                                    placeholder="hello@company.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onFocus={() => setInputFocus('email')}
                                                    onBlur={() => setInputFocus(null)}
                                                />
                                                {email && (
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className={`relative ${inputFocus === 'password' ? 'transform scale-105 transition-transform' : 'transition-transform'}`}
                                        >
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${inputFocus === 'password' ? 'text-primary' : 'text-gray-400'}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    autoComplete="current-password"
                                                    required
                                                    className={`input-focus-effect block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${inputFocus === 'password' ? 'bg-primary/5' : 'bg-white'}`}
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setInputFocus('password')}
                                                    onBlur={() => setInputFocus(null)}
                                                />
                                            </div>

                                            {/* Password strength indicator */}
                                            {password && (
                                                <div className="mt-2">
                                                    <div className={`h-1 rounded-full ${
                                                        password.length < 6 ? 'password-strength-1' :
                                                            password.length < 10 ? 'password-strength-2' : 'password-strength-3'
                                                    }`}></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 overflow-hidden"
                                        >
                                            {/* Background animation */}
                                            <div className="absolute inset-0 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-70"></div>
                                            </div>

                                            <span className="relative flex items-center">
                                                {isLoading ? (
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {isLogin ? 'Enter Dashboard' : 'Create Account'}
                                            </span>
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 relative">
                                    <div className="relative flex items-center">
                                        <div className="flex-grow border-t border-gray-300"></div>
                                        <div className="relative px-4">
                                            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <div className="h-8 w-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow border-t border-gray-300"></div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="group w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200"
                                            onClick={() => setIsLogin(!isLogin)}
                                        >
                                            <span className="relative inline-flex items-center group-hover:underline">
                                                {isLogin ? 'Need an account? Create one' : 'Already have an account? Sign in'}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-xs text-gray-500 italic">
                                 Administrative access only
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
