import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile } from '../spotify';
import styled from 'styled-components';

const StyledProfileContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLinkButton = styled.a`
  display: inline-block;
  top: var(--spacing-sm);
  left: var(--spacing-md);
  background-color: var(--green);
  color: var(--white);
  border-radius: var(--border-radius-pill);
  font-weight: 400;
  font-size: var(--fz-sm);
  padding: var(--spacing-sm) var(--spacing-xl);

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

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
      <StyledProfileContainer>
        {profile && (
          <>
            <h1>Hi, {profile.display_name}!</h1>
            <p>You have {profile.followers.total} followers.</p>
            {profile.images.length && profile.images[0].url && (
              <img src={profile.images[0].url} alt='Avatar' />
            )}
          </>
        )}
        <div>
          <StyledLinkButton>
            <a href='/short'>Short Term</a>
          </StyledLinkButton>
          <StyledLinkButton>
            <a href='/med'>Medium Term</a>
          </StyledLinkButton>
          <StyledLinkButton>
            <a href='/long'>Long Term</a>
          </StyledLinkButton>
        </div>
      </StyledProfileContainer>
    </>
  );
};

export default Profile;
