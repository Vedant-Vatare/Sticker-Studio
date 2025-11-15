import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { sendEmailCodeMutation, verifyEmailMutation } from '@/hooks/auth';
import { toast } from 'sonner';
import {
  useAuthTimeoutStore,
  useMailVerificationStore,
} from '@/store/userStore';
import { useEffect } from 'react';
import LoadingDots from '@/components/ui/LoadingDots';
import { motion } from 'motion/react';

const ResendVerificationCode = ({ email }) => {
  const { mutateAsync: sendEmailCode, isPending } = sendEmailCodeMutation();
  const timeoutString = useAuthTimeoutStore((store) => store.timeout);
  const timeoutInMs = new Date(timeoutString).getTime();
  const [timeLeft, setTimeLeft] = useState(timeoutInMs - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = timeoutInMs - Date.now();

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        return;
      }

      setTimeLeft(remaining);
    }, 500);

    return () => clearInterval(interval);
  }, [timeoutString]);

  const handleResendCode = async () => {
    try {
      await sendEmailCode(email);
      toast.success('Verification code sent successfully!');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to send verification code. Please try again.';
      toast.error(message);
    }
  };

  if (timeLeft > 0) {
    return (
      <span className="text-muted-foreground">
        resend code in{' '}
        <span className="text-primary">{parseInt(timeLeft / 1000)}s</span>
      </span>
    );
  }

  return (
    <Button variant={'ghost'} onClick={handleResendCode}>
      resend verification code
    </Button>
  );
};

const UserVerification = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { mutateAsync: verifyEmailCode, isPending } = verifyEmailMutation();
  const verificationEmail = useMailVerificationStore(
    (state) => state.verificationEmail,
  );

  useEffect(() => {
    if (!verificationEmail) {
      toast.error('No email found for verification.');
      navigate('/auth/signup');
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await verifyEmailCode({
        email: verificationEmail,
        code,
      });
      localStorage.setItem('userauthtoken', response.userAuthToken);
      navigate('/auth/setup-password');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to verify code. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="md:bg-primary/5 relative flex h-dvh w-full items-center justify-center md:p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md border-0 shadow-none outline-none md:px-2">
          <CardHeader>
            <CardTitle className="font-heading text-center text-2xl font-semibold">
              Verify your account
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-muted-foreground px-6 text-center text-sm text-balance">
            we have sent a verification code to your email address.
          </CardDescription>
          <CardContent className="space-y-6 md:px-6">
            <div className="flex flex-col items-center">
              <Label htmlFor="otp" className="mb-2 text-sm font-medium">
                Verification Code
              </Label>
              <InputOTP
                id={'otp'}
                maxLength={6}
                value={code}
                onChange={setCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className={'hidden sm:flex'} />
                <InputOTPGroup className={'ml-2 sm:ml-0'}>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={code.length < 6}
              className="bg-primary h-12 w-full rounded-full text-base"
            >
              {isPending ? <LoadingDots /> : 'Continue'}
            </Button>
          </CardContent>
          <div className="mx-auto w-[75vw] max-w-[75%]">
            <Separator />
          </div>
          <CardFooter className="text-primary flex flex-col space-y-2 text-sm font-medium">
            <ResendVerificationCode email={verificationEmail} />
            <span>
              <Link to="/auth/signup" className="underline">
                use different email?
              </Link>
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserVerification;
