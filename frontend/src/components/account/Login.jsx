import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import EmailVerificationModal, {supabase} from '../../hooks/Hooks.jsx'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Estado para manejar mensajes de error
    const [error, setError] = useState(null);
    // Estado para alternar entre login y registro (signup)
    const [isLogin, setIsLogin] = useState(true);
    // Estado para controlar el estado de carga (loading)
    const [isLoading, setIsLoading] = useState(false);
    // Estado para controlar el foco de los inputs
    const [inputFocus, setInputFocus] = useState(null);
    const navigate = useNavigate();
    // Estado para mostrar el modal de verificación de email
    const [showVerificationModal, setShowVerificationModal] = useState(false)


    // Función para iniciar sesión con email y contraseña
    async function signInWithEmail() {
        setIsLoading(true);
        setError(null); // Limpia errores anteriores
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (!error) {
                // Redirige a la página de cuenta si el login es exitoso
                navigate("/account", {state: {userData: data}});
            } else {
                setError(error); // Establece el error si falla el login
            }
        } catch (err) {
            setError(err); // Captura errores generales
        } finally {
            setIsLoading(false); // Finaliza el estado de carga
        }
    }

    // Función para registrar un nuevo usuario
    async function signUpNewUser() {
        setIsLoading(true);
        setError(null); // Limpia errores anteriores
        try {
            const {error} = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (!error) {
                // Muestra el modal de verificación y reinicia el formulario
                setShowVerificationModal(true);
                setIsLogin(true); // Vuelve a la vista de login
                setEmail('');
                setPassword('');
            } else {
                setError(error); // Establece el error si falla el registro
            }
        } catch (err) {
            setError(err); // Captura errores generales
        } finally {
            setIsLoading(false); // Finaliza el estado de carga
        }
    }

    // Maneja el envío del formulario (login o registro)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            signInWithEmail();
        } else {
            signUpNewUser();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    {isLogin ? 'Inicia sesión en tu cuenta' : 'Regístrate para una nueva cuenta'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Campo de Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Dirección de Correo Electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setInputFocus('email')}
                                    onBlur={() => setInputFocus(null)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Campo de Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setInputFocus('password')}
                                    onBlur={() => setInputFocus(null)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Mensaje de Error */}
                        {error && (
                            <div className="text-sm text-red-600 text-center">
                                {error.message}
                            </div>
                        )}

                        {/* Botón de Enviar */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-primary-dark dark:hover:bg-terciary-dark"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    isLogin ? 'Iniciar Sesión' : 'Registrarse'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Alternar entre Login y Registro */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"/>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300">
                                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                {isLogin ? 'Crear una cuenta' : 'Iniciar Sesión'}
                                <span className="ml-2">
                                                <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                                                     viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500 italic">
                        Solo acceso administrativo
                    </p>
                </div>
            </div>
            {/* Modal de verificación de email (se muestra después del registro) */}
            {showVerificationModal && (
                <EmailVerificationModal
                    isOpen={showVerificationModal}
                    onClose={() => setShowVerificationModal(false)}
                    email={email}
                />
            )}
        </div>
    );
};

export default Login;
