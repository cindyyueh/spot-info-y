import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtistsShort, getTopTracksShort } from '../spotify';
import ChartComponent from './ChartComponent';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

const StyledTermContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledBackButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    left: var(--spacing-lg);
  }
`;

const ShortTerm = () => {
  const [topArtistsShort, setTopArtistsShort] = useState([]);
  const [topTracksShort, setTopTracksShort] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtistsShort = await getTopArtistsShort();
      setTopArtistsShort(userTopArtistsShort.data.items);

      const userTopTracksShort = await getTopTracksShort();
      setTopTracksShort(userTopTracksShort.data.items);
    };

    catchErrors(fetchData());
  }, []);

  console.log(topArtistsShort)

  let genreHash = {};

  for (let i = 0; i < topArtistsShort.length; i++) {
    let currentArtist = topArtistsShort[i];
    for (let j = 0; j < currentArtist.genres.length; j++) {
      if (!genreHash[currentArtist.genres[j]]) {
        genreHash[currentArtist.genres[j]] = 1;
      } else {
        genreHash[currentArtist.genres[j]]++;
      }
    }
  }
  let total = Object.values(genreHash);
  let totalNum = total.reduce((a, b) => a + b, 0);

  let genreArr = Object.entries(genreHash);

  let result = [];
  for (var i = 0; i < genreArr.length; i++) {
    var genre = {};
    for (var j = 0; j < genreArr[i].length; j++) {
      genre.title = genreArr[i][0];
      genre.value = genreArr[i][1];
      genre.all = totalNum;
    }
    result.push(genre);
  }

  return (
    <>
      <Link to='/'>
        <StyledBackButton>Back</StyledBackButton>
      </Link>
      {/* <StyledTermContainer> */}
      {result.length > 0 ? <ChartComponent data={result} /> : <p>oops :(</p>}
      <div>

      <h1>TOP ARTISTS SHORT TERM (past 4 weeks)</h1>
      {topArtistsShort.map((artist) => {
        return (
          <div key={artist.id}>
            {artist.name} <img src={artist.images[0].url} style={{ width: "7%", height: "7%" }} alt='Artist' />
          </div>
        );
      })}
      <h1>TOP TRACKS SHORT TERM (past 4 weeks)</h1>
      {topTracksShort.map((track) => {
        return (
          <div key={track.id}>
            {track.name} -
            {track.artists.map((artist) => `${artist.name}, `)}
          </div>
        );
      })}
      </div>
      {/* </StyledTermContainer> */}
    </>
  );
};

export default ShortTerm;
