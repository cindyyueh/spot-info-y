import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile } from '../spotify';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <div>
          <h1>Hi, {profile.display_name}!</h1>
          <p>You have {profile.followers.total} followers.</p>
          {profile.images.length && profile.images[0].url && (
            <img src={profile.images[0].url} alt='Avatar' />
          )}
        </div>
      )}
      <a href='/short'>Short Term Pie - </a>
      <a href='/med'>Medium Term Pie - </a>
      <a href='/long'>Long Term Pie</a>
    </>
  );
};

export default Profile;
