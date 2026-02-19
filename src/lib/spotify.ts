const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

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

export async function getNowPlaying(): Promise<SpotifyTrack | null> {
  if (!client_id || !client_secret || !refresh_token) {
    return null;
  }

  try {
    const accessToken = await getAccessToken();

    // Try currently playing first
    const nowRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {Authorization: `Bearer ${accessToken}`},
      cache: 'no-store',
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data.item) {
        return {
          isPlaying: data.is_playing,
          title: data.item.name,
          artist: data.item.artists.map((a: {name: string}) => a.name).join(', '),
          album: data.item.album.name,
          albumImageUrl: data.item.album.images[0]?.url ?? '',
          songUrl: data.item.external_urls.spotify,
        };
      }
    }

    // Fall back to recently played
    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {Authorization: `Bearer ${accessToken}`},
      cache: 'no-store',
    });

    if (recentRes.status === 200) {
      const data = await recentRes.json();
      const track = data.items?.[0]?.track;
      if (track) {
        return {
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((a: {name: string}) => a.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0]?.url ?? '',
          songUrl: track.external_urls.spotify,
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}
