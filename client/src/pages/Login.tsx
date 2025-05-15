import { Link, useNavigate } from 'react-router';
import LoginForm from '../layouts/authlayout/components/LoginForm';
import { AppDispatch, RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../utils/dataSlice';
import { API } from '../App';
import Button from './components/Button';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.data,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        console.log('Token stored in localStorage');
      }
      navigate('/');
    } catch (err) {
      console.error('Error creating account:', err);
    }
  };
  console.log(data, loading, error);
  return (
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
        />
        <Button
          name="Login"
          type="submit"
          className="text-white"
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
    </div>
  );
};

export default Login;
