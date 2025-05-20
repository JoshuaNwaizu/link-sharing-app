import { Link, useNavigate } from 'react-router';
import LoginForm from '../layouts/authlayout/components/LoginForm';
import { AppDispatch, RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../utils/dataSlice';
import { API } from '../App';
import Button from './components/Button';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import Loader from './components/Loader';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.data,
  );
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    email: false,
    password: false,
    incorrectPassword: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset error for the specific field
    setValidationErrors((prev) => ({
      ...prev,
      [name]: false,
      incorrectPassword: false,
    }));
  };
  const isFormValid = () => {
    return formValues.email.trim() !== '' && formValues.password.trim() !== '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hasEmptyFields = {
      email: formValues.email.trim() === '',
      password: formValues.password.trim() === '',
      incorrectPassword: false,
    };

    setValidationErrors(hasEmptyFields);

    if (hasEmptyFields.email || hasEmptyFields.password) {
      toast.error('Please fill in all fields');
      return;
    }
    const newValidationErrors = {
      email: formValues.email.trim() === '',
      password: formValues.password.trim() === '',
      incorrectPassword: false,
    };
    setValidationErrors(newValidationErrors);
    if (!isFormValid()) {
      toast.error('Please fill in all fields');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await dispatch(
        fetchData({
          url: `${API}/login`,
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).unwrap();
      if (response.token) {
        localStorage.setItem('token', response.token);
        toast.success('Login successful!');
        console.log('Token stored in localStorage');
      }
      navigate('/');
    } catch (err: any) {
      console.error('Error creating account:', err);
      toast.error('Email or password is incorrect');
    }
  };
  console.log(data, loading, error);

  return (
    <>
      {loading && <Loader />}
      <div className="flex flex-col gap-8 md:bg-white md:w-[29.75rem]  md:p-[2.5rem]  md:transform md:scale-90 md:origin-center md:rounded-[0.75rem]">
        <div className="flex flex-col ">
          <h1 className="text-[#333] text-[1.5rem] font-bold leading-[2.25rem]">
            Login
          </h1>
          <p className="text-[1rem] leading-[1.5rem] text-[#737373]">
            Add your details below to get back into the app
          </p>
        </div>
        <form
          method="post"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit}
        >
          <LoginForm
            htmlFor="email"
            title="Email address"
            img="/images/icon-email.svg"
            alt="email"
            type="email"
            name="email"
            id="email"
            placeholder="e.g. alex@email.com"
            onChange={handleInputChange}
            errorMessage={validationErrors.email ? 'Email is required' : ''}
          />

          <LoginForm
            htmlFor="password"
            title="Password"
            img="/images/icon-password.svg"
            alt="password"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            onChange={handleInputChange}
            error={
              validationErrors.password || validationErrors.incorrectPassword
            }
            errorMessage={
              validationErrors.password
                ? 'Password is required'
                : validationErrors.incorrectPassword
                  ? 'Password is incorrect'
                  : ''
            }
          />
          <Button
            name={loading ? 'Logging in...' : 'Login'}
            type="submit"
            className={`text-white ${loading || !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || !isFormValid()}
          />
        </form>
        <div className="flex flex-col gap-2 items-center">
          <p>Don't have an account</p>
          <Link
            to="/auth/signup"
            className="text-[#633CFF]"
          >
            <p className="cursor-pointer text-[#633CFF]">Create account</p>
          </Link>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          theme="light"
        />
      </div>
    </>
  );
};

export default Login;
