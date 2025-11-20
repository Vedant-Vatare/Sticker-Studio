import { useUserProfile } from '@/hooks/user';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ResponsiveModal from '../ui/modal/ResponsiveModal';
import { useState } from 'react';

const AddFullNameForm = () => {
  const [fullName, setFullName] = useState('');
  return (
    <div>
      <Input
        id="full-name"
        placeholder={'add a name here'}
        value={fullName}
        className={'my-3'}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Button className={'w-full'}>Save</Button>
    </div>
  );
};

const Profile = () => {
  const { data: profile, isLoading, error } = useUserProfile();
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
    console.log(error);

    return <div>{error.message}</div>;
  }
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
          trigger={
            <Button className={'bg-muted'} variant={'secondary'}>
              Edit
            </Button>
          }
          title="Full name"
          description=""
        >
          <AddFullNameForm />
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
        <Button className={'bg-muted'} variant={'secondary'}>
          Change
        </Button>
      </div>
    </div>
  );
};

export default Profile;
