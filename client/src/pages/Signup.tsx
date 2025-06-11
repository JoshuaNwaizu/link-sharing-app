import { Link, useNavigate } from 'react-router';
import LoginForm from '../layouts/authlayout/components/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchData } from '../utils/dataSlice';
import { API } from '../App';
import Button from './components/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Loader from './components/Loader';
import { motion } from 'framer-motion';

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [validationErrors, setValidationErrors] = useState({
    password: false,
    confirmPassword: false,
    showErrors: false,
  });
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.data,
  );
  console.log(data, loading, error);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Add input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add function to check if form is valid
  const isFormValid = () => {
    return (
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== ''
    );
  };
  const getPasswordError = (password: string) => {
    if (password.length > 0 && password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const getConfirmPasswordError = (
    password: string,
    confirmPassword: string,
  ) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Please fill in all fields');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    setValidationErrors({
      password: password.length < 8,
      confirmPassword: password !== confirmPassword,
      showErrors: true,
    });

    if (password.length < 8) {
      setValidationErrors((prev) => ({ ...prev, password: true }));
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: true }));
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await dispatch(
        fetchData({
          url: `${API}/create-account`,
          method: 'POST',
          body: JSON.stringify({ email, password, confirmPassword }),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).unwrap();
      console.log('Signup response:', response);
      navigate('/auth/login');
      if (response.token) {
        toast.success('Account created successfully!');
      }
    } catch (err: any) {
      console.error('Error creating account:', err);
      console.error(err.message);
      const status = err?.status || err?.response?.status || err?.code;
      console.error('Error status:', status);
      if (status === 404) {
        toast.error('Email is already in use');
      } else {
        toast.error('Error creating account');
      }
    }
  };

  return (
    <>
      {loading && <Loader />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col  gap-8 md:bg-white md:w-[29.75rem]  md:p-[2.5rem]  md:transform md:scale-90 md:origin-center md:rounded-[0.75rem]"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-[#333] text-[1.5rem] font-bold leading-[2.25rem]">
            Create account
          </h1>
          <p className="text-[1rem] leading-[1.5rem] text-[#737373]">
            Let’s get you started sharing your links!
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
            onChange={handleInputChange}
            placeholder="e.g. alex@email.com"
          />
          <LoginForm
            htmlFor="password"
            title="Create password"
            img="/images/icon-password.svg"
            alt="password"
            type="password"
            name="password"
            id="password"
            onChange={handleInputChange}
            error={validationErrors.showErrors && validationErrors.password}
            errorMessage={getPasswordError(formData.password)}
            placeholder="At least 8 characters"
          />

          <LoginForm
            htmlFor="password"
            title="Confirm password"
            img="/images/icon-password.svg"
            alt="confirmPassword"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleInputChange}
            confirmPassword={validationErrors.confirmPassword}
            placeholder="At least 8 characters"
            error={
              validationErrors.showErrors && validationErrors.confirmPassword
            }
            errorMessage={getConfirmPasswordError(
              formData.password,
              formData.confirmPassword,
            )}
          />
          <Button
            name={loading ? 'Creating account...' : 'Create account'}
            type="submit"
            className={`text-white ${loading || !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || !isFormValid()}
          />
        </form>
        <div className="flex flex-col gap-2 items-center">
          <p>Already have an account</p>
          <Link
            to="/auth/login"
            className="text-[#633CFF]"
          >
            <p className="cursor-pointer text-[#633CFF]">Login</p>
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default Signup;
