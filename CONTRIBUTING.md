# Contributing

Thanks for wanting to contribute! This project stores community event entries as JSON objects in `data/events.json`.

Schema for each event (JSON object):

- id: string - unique id (use something like `event-YYYYMMDD-title`)
- title: string - event title
- date: string - ISO 8601 date (YYYY-MM-DD)
- location: string - where it happened (can be online)
- description: string - short description (1-2 sentences)
- facebook_post: string - URL to the original Facebook post
- contributor: string - GitHub username or name of the contributor
- tags: array of strings - optional tags (community, meetup, workshop)

Example entry:

{
  "id": "event-20251006-community-meetup",
  "title": "Community Meetup",
  "date": "2025-10-06",
  "location": "City Library",
  "description": "A meetup to discuss community projects.",
  "facebook_post": "https://www.facebook.com/yourpage/posts/1234567890",
  "contributor": "alice",
  "tags": ["meetup","community"]
}

Rules:
- Add only one object per PR (unless you're adding multiple events you authored).
- Ensure `id` is unique. If uncertain, use a UUID or include date + short title.
- Provide a valid `facebook_post` URL and a readable `description`.

Validation
- There's a simple validation script: `node scripts/validate.js data/events.json`.

How to submit
1. Fork.
2. Create a branch.
3. Edit `data/events.json` and add your entry.
4. Run the validator locally.
5. Open a PR and reference Hacktoberfest if you want it counted.

If you need help, open an issue.
