import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtistsLong, getTopTracksLong } from '../spotify';
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

export const Column = styled.div`
  flex: ${(props) => props.size};
`;

export const Grid = styled.div`
  display: grid
  grid-template-areas: "column column"
  grid-gap: 5px
  justify-content: center;
`;

export const Row = styled.div`
  display: flex;
`;

const LongTerm = () => {
  const [topArtistsLong, setTopArtistsLong] = useState([]);
  const [topTracksLong, setTopTracksLong] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtistsLong = await getTopArtistsLong();
      setTopArtistsLong(userTopArtistsLong.data.items);

      const userTopTracksLong = await getTopTracksLong();
      setTopTracksLong(userTopTracksLong.data.items);
    };

    catchErrors(fetchData());
  }, []);

  let genreHash = {};

  for (let i = 0; i < topArtistsLong.length; i++) {
    let currentArtist = topArtistsLong[i];
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
      <div>
        <h1>Your Long Term Donut!</h1>
        {result.length > 0 ? <ChartComponent data={result} /> : <p>oops :(</p>}
      </div>
      <Grid>
        <Row>
          <Column>
            <h1>TOP ARTISTS (past 12 months)</h1>
            {topArtistsLong.map((artist) => {
              return (
                <p key={artist.id}>
                  <img
                    src={artist.images[0].url}
                    style={{ width: '15%', height: '10%' }}
                    alt='Artist'
                  />
                  {' '}{artist.name}
                </p>
              );
            })}
          </Column>
          <Column>
            <h1>TOP TRACKS (past 12 months)</h1>
            {topTracksLong.map((track) => {
              return (
                <p key={track.id}>
                  <img
                    src={track.album.images[0].url}
                    style={{ width: '11%', height: '10%' }}
                    alt='Track'
                  />
                  {' '}{track.name}
                  {' - '}
                  {track.artists.map((artist, idx) => {
                    if (idx === track.artists.length - 1) {
                      return `${artist.name} `;
                    }
                    return `${artist.name}, `;
                  })}
                </p>
              );
            })}
          </Column>
        </Row>
      </Grid>
    </>
  );
};

export default LongTerm;
