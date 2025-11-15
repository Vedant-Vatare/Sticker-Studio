import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LoadingDots from '@/components/ui/LoadingDots';
import { Phone } from 'lucide-react';
import { Label } from '../../ui/label';
import { loginUserMutation } from '@/hooks/auth';
import { toast } from 'sonner';
import { EyeOff } from 'lucide-react';
import { EyeIcon } from 'lucide-react';

const GoogleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Login = ({ isAsModal }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: loginUser, isPending } = loginUserMutation();
  const handleSubmit = async () => {
    try {
      const response = await loginUser({ email, password });

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to login. Please try again later';
      toast.error(message);
    }
  };
  return (
    <div
      className={`md:bg-primary/5 relative flex items-center justify-center ${isAsModal ? 'h-full w-full' : 'h-dvh md:p-4'}`}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md border-0 px-2 py-10 shadow-none outline-none">
          <CardHeader>
            <CardTitle className="font-heading text-center text-2xl font-semibold">
              Login to your account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-3 md:px-6">
            <div>
              <Label htmlFor="email" className="mb-1 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-primary h-12 rounded-sm text-base"
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1 text-sm font-medium">
                password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary h-12 rounded-sm text-base"
                />
                <Button
                  size={'icon'}
                  onClick={() => setShowPassword(!showPassword)}
                  variant={'ghost'}
                  className="absolute top-2 right-2 my-auto"
                >
                  {showPassword ? <EyeOff /> : <EyeIcon />}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="bg-primary h-12 w-full rounded-full text-base"
              disabled={!email}
            >
              {isPending ? <LoadingDots /> : 'Login'}
            </Button>

            <div className="relative mt-3">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="text-muted-foreground bg-white px-2">
                  or login with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 w-full">
                <Phone className="mr-2 h-5 w-5" />
                Phone
              </Button>
              <Button variant="outline" className="h-12 w-full">
                <GoogleIcon />
                <span className="ml-2">Google</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-muted-foreground text-center text-sm">
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="text-primary font-medium hover:underline"
              >
                Signup
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
