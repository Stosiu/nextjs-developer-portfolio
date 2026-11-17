# Stats dashboard and open source section

## Data sources

GitHub contributions and the language breakdown come from the GraphQL API and are cached by ISR. All-time contributions are fetched one year per request, because GitHub returns a 502 when a single query covers many years.

Claude Code token usage and cost are aggregated from the [`ccusage`](https://github.com/ryoppippi/ccusage) CLI and uploaded to R2 with `pnpm upload:ai`. The site reads `stats/ai.json` from the bucket's public URL and caches it for a day.

Spotify now-playing is fetched at request time. The card is hidden when Spotify returns nothing to show.

The open source section reads `src/config/open-source.ts`. For each repository it fetches the star count and your merged pull requests from the GitHub REST API, and weekly downloads of `npmPackage` from the npm registry, cached for a day. Your GitHub login is taken from `social.github` in `src/config/site.ts`. An empty list hides the section and its nav link.

## Warming the cache

On Vercel, `/api/cron/stats` runs daily at 6:00 UTC (configured in `vercel.json`). On other hosts, point a cron service at the same endpoint:

```bash
curl -X GET https://your-site.com/api/cron/stats -H "Authorization: Bearer $CRON_SECRET"
```

## Scheduling the AI stats upload

```bash
pnpm setup:cron    # interactive: pick a time, confirms before installing
pnpm remove:cron   # uninstall
```

The installer uses launchd on macOS (`~/Library/LaunchAgents/`), crontab on Linux and Task Scheduler on Windows. On macOS the job runs inside a login shell (`zsh -l -c "..."`), because launchd otherwise starts with a minimal environment in which node version managers such as nvm, fnm and volta never initialize. `RunAtLoad` is enabled, so a machine that was asleep at the scheduled time catches up on the next login.

```bash
launchctl print gui/$(id -u)/com.stosiu.upload-ai       # status
launchctl kickstart gui/$(id -u)/com.stosiu.upload-ai   # run now
tail -f ~/Library/Logs/upload-ai/stdout.log             # logs
```

## Getting a Spotify refresh token

1. Create an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and copy the client ID and secret into `.env`.
2. Add a redirect URI in the app settings, for example `https://your-site.vercel.app/callback`.
3. Open this URL with the placeholders replaced:

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
   ```

4. Authorize. The redirect target may fail to load; copy the `code` parameter from the URL bar.
5. Exchange it for a refresh token:

   ```bash
   curl -s -X POST https://accounts.spotify.com/api/token \
     -d grant_type=authorization_code \
     -d code=YOUR_CODE \
     -d redirect_uri=YOUR_REDIRECT_URI \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET
   ```

6. Put `refresh_token` from the response into `.env` as `SPOTIFY_REFRESH_TOKEN`.
