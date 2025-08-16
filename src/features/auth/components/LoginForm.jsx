import { useState } from 'react';
import imglogo from '../../../assets/images/load.svg'
import { useLogin } from '../hooks/useAuth';


const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5 text-gray-400"
  >
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path
      fillRule="evenodd"
      d="M.329 8.223a2.25 2.25 0 010 3.554l-.452.452a1.5 1.5 0 00-.44 1.061V15a3 3 0 003 3h1.061a1.5 1.5 0 001.061-.44l.452-.452a2.25 2.25 0 013.554 0l.452.452a1.5 1.5 0 001.061.44H18a3 3 0 003-3v-1.711a1.5 1.5 0 00-.44-1.061l-.452-.452a2.25 2.25 0 010-3.554l.452-.452A1.5 1.5 0 0021 6.711V5a3 3 0 00-3-3h-1.711a1.5 1.5 0 00-1.061.44l-.452.452a2.25 2.25 0 01-3.554 0L9.135 2.44A1.5 1.5 0 008.074 2H6a3 3 0 00-3 3v1.711a1.5 1.5 0 00.44 1.061L.329 8.223zM9 10a1 1 0 112 0 1 1 0 01-2 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Inline SVG for the eye-invisible icon (hidden password).
const EyeInvisibleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5 text-gray-400"
  >
    <path
      fillRule="evenodd"
      d="M3.707 2.293a1 1 0 00-1.414 1.414L5.586 8.5H4a1 1 0 000 2h1.586L2.293 13.293a1 1 0 101.414 1.414L8 11.414V13a1 1 0 002 0v-1.586l1.293 1.293a1 1 0 101.414-1.414L10.414 8.5H12a1 1 0 000-2h-1.586l-1.293-1.293a1 1 0 10-1.414 1.414L8.586 8.5l-.793.793a1 1 0 01-1.414 0l-3.293-3.293zM10 10a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

// Inline SVG for the loading spinner.
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const loginMutation = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    try {
      await loginMutation.mutate({ email, password });
    } catch (error) {
      if (error.message === "Email not registered") {
        setEmailError(true);
      } else if (error.message === "Incorrect password") {
        setPasswordError(true);
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  return (
    <div className="font-sans min-h-screen flex bg-gray-100 antialiased">
      {/* Left side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-grey-600 items-center justify-center rounded-r-3xl shadow-xl">
        <img src={imglogo} alt="YotaPerformance Logo" className="h-72 w-72 mb-4" />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 mb-4 lg:hidden">
             
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`mt-1 block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {emailError && (
                  <p className="mt-2 text-sm text-red-600 font-medium">Incorrect email</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 transition-all duration-200 ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeInvisibleIcon /> : <EyeIcon />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600 font-medium">Incorrect password</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loginMutation.isPending ? (
                <Spinner />
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;