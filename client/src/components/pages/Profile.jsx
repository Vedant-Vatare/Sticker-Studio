import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ResponsiveModal from '../ui/modal/ResponsiveModal';
import { useUpdateUserProfile, useUserProfile } from '@/hooks/user';
import LoadingDots from '../ui/LoadingDots';
import ServerError from './ServerError';
import { EyeIcon, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AddFullNameForm = ({ closeModal }) => {
  const [fullName, setFullName] = useState('');
  const { mutate: udpateFullname, isPending } = useUpdateUserProfile();
  const handleSubmit = async () => {
    udpateFullname(
      { full_name: fullName },
      {
        onSuccess: () => {
          closeModal();
          setFullName('');
        },
      },
    );
  };

  return (
    <div>
      <Input
        id="full-name"
        placeholder={'add a name here'}
        value={fullName}
        className={'my-3'}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Button
        className={'w-full'}
        disabled={fullName.length === 0}
        onClick={handleSubmit}
      >
        {isPending ? <LoadingDots /> : 'Save'}
      </Button>
    </div>
  );
};

const ChangePasswordForm = ({ closeModal }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: udpateFullname, isPending } = useUpdateUserProfile();

  const handleSubmit = async () => {
    udpateFullname(
      { password },
      {
        onSuccess: () => {
          closeModal();
          toast.success('Password was changed successfully');
          setPassword('');
          setConfirmPassword('');
        },
      },
    );
  };

  return (
    <div>
      <div className="relative w-full">
        <Input
          type={`${showPassword ? 'text' : 'password'}`}
          placeholder={'password'}
          value={password}
          className={'my-2 rounded-xs py-5 text-lg'}
          onPaste={(e) => e.preventDefault()}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className={'absolute inset-y-0 right-5 m-auto'}
          variant={'ghost'}
          size={'icon'}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeIcon /> : <EyeOff />}
        </Button>
      </div>
      <div className="relative w-full">
        <Input
          type={`${showConfirmPassword ? 'text' : 'password'}`}
          placeholder={'confirm password'}
          value={confirmPassword}
          className={'my-2 rounded-xs py-5 text-lg'}
          onPaste={(e) => e.preventDefault()}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          className={'absolute inset-y-0 right-5 m-auto'}
          variant={'ghost'}
          size={'icon'}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeIcon /> : <EyeOff />}
        </Button>
      </div>
      <Button
        className={'mt-2 w-full'}
        disabled={password.length < 8 || password != confirmPassword}
        onClick={handleSubmit}
      >
        {isPending ? <LoadingDots /> : 'Save'}
      </Button>
    </div>
  );
};

const Profile = () => {
  const { data: profile, isLoading, error, isSuccess } = useUserProfile();
  const [openNameModal, setOpenNameModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  if (isLoading) {
    return (
      <div className="bg-accent/20 mx-auto max-w-3xl px-2 py-8 sm:px-6 md:mt-5 lg:px-8">
        <h1 className="text-foreground page-title">Profile</h1>
        <div className="my-4 mt-7 flex flex-col items-center gap-4 px-1 py-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ServerError />;
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-3xl px-2 py-8 sm:px-6 md:mt-5 lg:px-8">
        <h1 className="text-foreground page-title">Profile</h1>
        <div className="my-2 mt-7 flex items-center justify-between px-1 py-2 md:my-4">
          <span
            className={`font-heading flex flex-col tracking-wide ${!profile.full_name && 'opacity-60'}`}
          >
            Full name
            {!!profile.full_name && (
              <span className="font-heading font-semibold">
                {profile.full_name}
              </span>
            )}
          </span>
          <ResponsiveModal
            onOpenChange={setOpenNameModal}
            open={openNameModal}
            showCloseButton={true}
            trigger={
              <Button className={'bg-muted'} variant={'secondary'}>
                Edit
              </Button>
            }
            title="Full name"
          >
            <AddFullNameForm closeModal={() => setOpenNameModal(false)} />
          </ResponsiveModal>
        </div>
        <Separator className={'bg-accent-foreground/10 h-0.5'} />
        <div className="my-2 flex items-center justify-between px-1 py-2 md:my-4">
          <span
            className={`font-heading tracking-wide ${!profile.email && 'opacity-60'}`}
          >
            Email
          </span>
          {profile.email ? (
            <span className="font-heading">{profile.email}</span>
          ) : (
            <Button className={'bg-muted'} variant={'secondary'}>
              Add email
            </Button>
          )}
        </div>
        <Separator className={'bg-accent-foreground/10 h-0.5'} />
        <div className="my-2 flex items-center justify-between px-1 py-2 md:my-4">
          <span
            className={`font-heading tracking-wide ${!profile.phone && 'opacity-60'}`}
          >
            Phone
          </span>
          {profile.phone ? (
            <span className="font-heading font-medium">{profile.phone}</span>
          ) : (
            <Button className={'bg-muted'} variant={'secondary'}>
              Add phone
            </Button>
          )}
        </div>
        <Separator className={'bg-accent-foreground/10 h-0.5'} />
        <div className="my-2 flex items-center justify-between px-1 py-2 md:my-4">
          <span>
            <span className="font-heading tracking-wide">password</span>
            <span className="text-muted-foreground mt-0.5 block tracking-wider">
              ••••••••
            </span>
          </span>
          <ResponsiveModal
            onOpenChange={setOpenPasswordModal}
            open={openPasswordModal}
            showCloseButton={true}
            trigger={
              <Button className={'bg-muted'} variant={'secondary'}>
                Change
              </Button>
            }
            title="set new password"
            description="change the password of your account"
          >
            <ChangePasswordForm
              closeModal={() => setOpenPasswordModal(false)}
            />
          </ResponsiveModal>
        </div>
      </div>
    );
  }
};

export default Profile;
