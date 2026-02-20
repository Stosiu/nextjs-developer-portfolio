const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=short_term';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists?limit=1&time_range=short_term';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    cache: 'no-store',
  });

  const data = await res.json();
  return data.access_token;
}

export type SpotifyTrack = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
};

export type SpotifyTopTrack = {
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
};

export type SpotifyTopArtist = {
  name: string;
  imageUrl: string;
  genres: string[];
  url: string;
};

export type SpotifyData = {
  nowPlaying: SpotifyTrack | null;
  topTracks: SpotifyTopTrack[];
  topArtist: SpotifyTopArtist | null;
};

type SpotifyArtist = {name: string};
type SpotifyImage = {url: string};
type SpotifyAlbum = {name: string; images: SpotifyImage[]};
type SpotifyExternalUrls = {spotify: string};

type SpotifyTrackItem = {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: SpotifyExternalUrls;
};

async function fetchWithToken(url: string, accessToken: string) {
  return fetch(url, {
    headers: {Authorization: `Bearer ${accessToken}`},
    cache: 'no-store',
  });
}

export async function getSpotifyData(): Promise<SpotifyData> {
  if (!client_id || !client_secret || !refresh_token) {
    return {nowPlaying: null, topTracks: [], topArtist: null};
  }

  try {
    const accessToken = await getAccessToken();

    const [nowRes, recentRes, topTracksRes, topArtistsRes] = await Promise.all([
      fetchWithToken(NOW_PLAYING_ENDPOINT, accessToken),
      fetchWithToken(RECENTLY_PLAYED_ENDPOINT, accessToken),
      fetchWithToken(TOP_TRACKS_ENDPOINT, accessToken),
      fetchWithToken(TOP_ARTISTS_ENDPOINT, accessToken),
    ]);

    // Now playing / recently played
    let nowPlaying: SpotifyTrack | null = null;

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data.item) {
        nowPlaying = {
          isPlaying: data.is_playing,
          title: data.item.name,
          artist: data.item.artists.map((a: SpotifyArtist) => a.name).join(', '),
          album: data.item.album.name,
          albumImageUrl: data.item.album.images[0]?.url ?? '',
          songUrl: data.item.external_urls.spotify,
        };
      }
    }

    if (!nowPlaying && recentRes.status === 200) {
      const data = await recentRes.json();
      const track = data.items?.[0]?.track;
      if (track) {
        nowPlaying = {
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((a: SpotifyArtist) => a.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0]?.url ?? '',
          songUrl: track.external_urls.spotify,
        };
      }
    }

    // Top tracks (last 4 weeks)
    let topTracks: SpotifyTopTrack[] = [];
    if (topTracksRes.status === 200) {
      const data = await topTracksRes.json();
      topTracks = (data.items ?? []).map((t: SpotifyTrackItem) => ({
        title: t.name,
        artist: t.artists.map((a: SpotifyArtist) => a.name).join(', '),
        albumImageUrl: t.album.images[0]?.url ?? '',
        songUrl: t.external_urls.spotify,
      }));
    }

    // Top artist (last 4 weeks)
    let topArtist: SpotifyTopArtist | null = null;
    if (topArtistsRes.status === 200) {
      const data = await topArtistsRes.json();
      const artist = data.items?.[0];
      if (artist) {
        topArtist = {
          name: artist.name,
          imageUrl: artist.images?.[0]?.url ?? '',
          genres: (artist.genres ?? []).slice(0, 3),
          url: artist.external_urls.spotify,
        };
      }
    }

    return {nowPlaying, topTracks, topArtist};
  } catch {
    return {nowPlaying: null, topTracks: [], topArtist: null};
  }
}
