import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtistsMed, getTopTracksMed } from '../spotify';
import ChartComponent from './ChartComponent';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

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

const MediumTerm = () => {
  const [topArtistsMed, setTopArtistsMed] = useState([]);
  const [topTracksMed, setTopTracksMed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtistsMed = await getTopArtistsMed();
      setTopArtistsMed(userTopArtistsMed.data.items);

      const userTopTracksMed = await getTopTracksMed();
      setTopTracksMed(userTopTracksMed.data.items);
    };

    catchErrors(fetchData());
  }, []);

  let genreHash = {};

  for (let i = 0; i < topArtistsMed.length; i++) {
    let currentArtist = topArtistsMed[i];
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
      {result.length > 0 ? <ChartComponent data={result} /> : <p>oops :(</p>}
      <h1>TOP ARTISTS MEDIUM TERM (past 6 months)</h1>
      {topArtistsMed.map((artist) => {
        return (
          <div key={artist.id}>
            {artist.name} - GENRES: {artist.genres.map((genre) => `${genre}, `)}
          </div>
        );
      })}

      <h1>TOP TRACKS MED TERM (past 6 months)</h1>
      {topTracksMed.map((track) => {
        return (
          <div key={track.id}>
            {track.name} - ARTISTS:{' '}
            {track.artists.map((artist) => `${artist.name}, `)}
          </div>
        );
      })}
    </>
  );
};

export default MediumTerm;
