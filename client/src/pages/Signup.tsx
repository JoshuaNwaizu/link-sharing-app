import { Link, useNavigate } from 'react-router';
import LoginForm from '../layouts/authlayout/components/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchData } from '../utils/dataSlice';
import { API } from '../App';
import Button from './components/Button';

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.data,
  );
  console.log(data, loading, error);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

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
      navigate('/auth/login');
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('Token stored in localStorage', response.token);
      }
    } catch (err) {
      console.error('Error creating account:', err);
    }
  };
  return (
    <div className="flex flex-col gap-8">
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
          placeholder="At least 8 characters"
        />
        <Button
          name="Create account"
          type="submit"
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
    </div>
  );
};

export default Signup;
