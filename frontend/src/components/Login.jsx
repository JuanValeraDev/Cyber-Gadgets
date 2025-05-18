// src/components/Login.jsx (Simplified)
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthError, createClient} from "@supabase/supabase-js";

//Pongo aquí las variables supabaseURL y supabaseKey porque son variables públicas que pueden exponerse en el front sin riesgo de seguridad
const supabase = createClient(
    "https://plywzkndxxlnuivlqige.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXd6a25keHhsbnVpdmxxaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzM0NDIsImV4cCI6MjA2MDY0OTQ0Mn0.RllzUJ6nWn4RrAVMEvud1huuN6G8eRxtBOokB-njTgI"
);

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(new AuthError());
    const [isLogin, setIsLogin] = useState(true);

    const [data, setData] = useState(null)
    const navigate = useNavigate()

    async function signInWithEmail() {
        console.log("En signInWithEmail");

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (!error) {
            setData(data);
            navigate("/account", {state: {userData: data}});
        } else {
            setError(error);
            navigate("/login");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>

                    {error && <p className="text-red-500 text-center">{error.message}</p>}
                    <form className="mt-8 space-y-6" onSubmit={(event) => {
                        event.preventDefault();
                        signInWithEmail();
                    }}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default Login;
