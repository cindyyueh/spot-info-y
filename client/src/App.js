import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useLocation,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';
import { GlobalStyle } from './styles';
import { Login, LongTerm, MediumTerm, Profile, ShortTerm } from './pages';
import styled from 'styled-components/macro';

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div className='App'>
      <GlobalStyle />
      <header className='App-header'>
        {!token ? (
          <Login />
        ) : (
          <>
            <Router>
              {/* <ScrollToTop> */}
              <Routes>
                <Route path='/short' element={<ShortTerm />}></Route>
                <Route path='/med' element={<MediumTerm />}></Route>
                <Route path='/long' element={<LongTerm />}></Route>
                <Route exact path='/' element={<Profile />}></Route>
              </Routes>
              {/* </ScrollToTop> */}
            </Router>
            <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
