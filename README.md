# Kookee starter for Next.js

A Next.js site for the content of a [Kookee](https://kookee.dev) project: a blog, a changelog, a
help center with search, your pages and a read-only roadmap, plus the Kookee site widget. Pages
are rendered on the server and cached, and a webhook refreshes them when you publish.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkookee-dot-dev%2Fstarter-nextjs&env=KOOKEE_API_KEY&envDescription=A%20standard%20API%20key%20from%20your%20Kookee%20project%20(API%20keys%20%E2%86%92%20Create%20Key)&envLink=https%3A%2F%2Fkookee.dev%2Fhelp%2Fsdk-amp-integration%2Fstart-a-site-from-the-nextjs-starter&project-name=kookee-site&repository-name=kookee-site)

Built with Next.js 16 (App Router, Cache Components),
[`@kookee/sdk`](https://www.npmjs.com/package/@kookee/sdk) and
[`@kookee/react`](https://www.npmjs.com/package/@kookee/react). No Tailwind: one stylesheet,
`app/site.css`.

## What you get

| Path | What it shows |
| --- | --- |
| `/` | The newest posts and changelog entries, and the help categories |
| `/blog`, `/blog/page/2`, `/blog/{slug}` | Blog posts, 12 per page; a post with its table of contents and reactions |
| `/changelog`, `/changelog/page/2`, `/changelog/{slug}` | Changelog entries; an entry with reactions |
| `/help`, `/help/{category}`, `/help/{category}/{slug}` | Help categories and search as you type; a category's articles; an article with its table of contents and the "Was this article helpful?" vote |
| `/roadmap` | The open feedback posts by column, read-only. `KOOKEE_ROADMAP=false` hides it |
| `/{slug}` | Your pages, such as `/about` or `/privacy` |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/blog/rss.xml`, `/changelog/rss.xml` | Files for search engines, AI crawlers and feed readers |

The header carries a "What's new" badge with the latest changelog entries, and a link to your
hosted portal when the project has it switched on. The site widget appears once you save its
settings in the Kookee dashboard (**Site widget → Customize**) and the pages refresh: within
`KOOKEE_REVALIDATE_SECONDS`, or right after a redeploy. **Reset to the plain chat** removes it the
same way. Once it shows, it loads its tabs and texts in the browser, so later changes to them show
within about a minute.

Every post, changelog entry, help article and page has its title, description, canonical URL, Open
Graph tags and schema.org JSON-LD, taken from the entry and its SEO fields; the lists have a title
and a canonical URL.

## Quick start

1. In [Kookee](https://kookee.dev), create a project (or open one), go to **API keys** and press
   **Create Key**.
2. Get the code, either with **Use this template** on GitHub or:

   ```bash
   npx create-next-app@latest --example https://github.com/kookee-dot-dev/starter-nextjs my-site
   cd my-site
   ```

3. Copy `.env.example` to `.env.local` and set `KOOKEE_API_KEY`.
4. Run `npm run dev` and open http://localhost:3000.

Without a key every page shows a short setup guide instead of content, and `npm run build` still
passes.

To deploy, press **Deploy with Vercel** above: it copies the repository to your GitHub account and
asks for `KOOKEE_API_KEY`. Any host that runs Next.js works; set the same variables there.

## Environment variables

| Name | Required | Default | What it does |
| --- | --- | --- | --- |
| `KOOKEE_API_KEY` | yes | | A standard API key of your project |
| `SITE_URL` | no | `https://` + Vercel's production domain, else `http://localhost:3000` | The site's address in canonical URLs, the sitemap, feeds and `llms.txt` |
| `KOOKEE_REVALIDATE_SECONDS` | no | `21600` (6 hours) | How long a page is served before it is rebuilt in the background. Read at build time, so a change needs a redeploy |
| `KOOKEE_ROADMAP` | no | `true` | `false` hides `/roadmap` and its header link |
| `KOOKEE_WEBHOOK_SECRET` | no | | The signing secret of a Kookee webhook endpoint. Turns on `/api/kookee-webhook` |

## Allowed origins

The key is read on the server, and it is also sent to the browser for the parts that run there:
reactions, the helpful vote, help search and the site widget. In Kookee, open **Settings →
Project** and add your production domain and `http://localhost` to the **Allowed Origins** card;
`http://localhost` covers every port, and an origin with a port is not accepted. Once the list
holds an address, browsers on other sites are refused with `403 ORIGIN_NOT_ALLOWED`; while it is
empty, any site can use the key. The list belongs to the project, so it has to name every site
that uses the project's keys from a browser, such as a widget on your product's own site. The
server's own reads send no `Origin` header and are not affected. Only owners and admins can change
the list.

## What the key can do

Anyone can copy the key from your pages. With it they can read your published content, add
reactions and helpful votes, search the help center, ask the AI assistant and send feedback
through the widget. It cannot read drafts or change content.

Allowed origins stop other sites' browsers, not scripts, which send no `Origin` header. If the key
is abused, create a new one, put it in `KOOKEE_API_KEY`, redeploy, and then revoke the old one
(**Revoke key** on the **API keys** page).

## How content stays fresh

Each Kookee read is cached with the page that uses it (`'use cache'` in `lib/kookee.ts`). A page
is served from the cache until `KOOKEE_REVALIDATE_SECONDS` have passed; the next visit after that
gets the cached page and starts a rebuild in the background.

To see changes as soon as you publish, add a webhook:

1. In Kookee, open **Webhooks**, press **Add endpoint**, enter
   `https://<your-site>/api/kookee-webhook` and subscribe to the four `entry.*` events (published,
   updated, unpublished, deleted). Copy the endpoint's signing secret (`whsec_…`).
2. Set `KOOKEE_WEBHOOK_SECRET` to that secret in your host's environment and redeploy.
3. In the endpoint's menu, press **Send test**. Kookee shows "Test event delivered".

Until the secret is deployed the route answers 404, and with a wrong secret 401; Kookee counts
both as failed deliveries. After a publish or an update, the next visit still gets the cached page
and starts the refresh, and later visits see the change; an unpublished or deleted entry is gone
from the next page served.

- The endpoint must be a public `https` address, so testing it locally needs a tunnel.
- Only a project owner or admin can add webhooks. On the Free plan a project has 2 endpoints and
  100 deliveries an hour; the rest are dropped.
- Some changes send no event and wait for the time window: renaming the project, a category or a
  tag, roadmap changes, a changed slug of an entry that another type links to, and the first save
  or a reset of the widget settings.

## API usage

Every request the site makes with its key counts against the monthly request quota of the project
owner's account, shared by all their projects:

- the server's reads, each time a page is built or rebuilt (the layout's project, changelog and
  page reads included);
- in the browser: each help search, the widget's Help tab and article reader, and a reaction or
  helpful vote when clicked.

The widget's settings and its AI chat are not API requests; each chat answer uses the account's AI
answers. The Free plan has 100,000 requests a month and 50 AI answers, and a project takes at most
300 requests a minute, shared by the server and the browsers.

Reading a blog post, page or help article also counts a view in Kookee. Here that happens once per
build or rebuild of the page, not once per reader; a help article opened in the widget's article
reader counts a view each time. Help article views order the popular articles in the widget and on
the portal. Changelog entries count no views.

## Customizing

- **Look:** the tokens at the top of `app/site.css`. The `.kookee-content` rule hands them to
  every Kookee component; dark mode follows the operating system.
- **URLs:** `lib/paths.ts`. `getPath` decides where each entry lives (links inside entry bodies,
  the sitemap and the feeds use
it), and `hrefs` gives the same paths to the lists, search and "What's new". Change both when you
change a route.
- **Pages:** the routes in `app/` are short. The components and their props are documented in the
  [`@kookee/react` README](https://www.npmjs.com/package/@kookee/react).
- **Languages:** the site reads your project's default language only, so every entry has one URL.
- **Not shown:** help articles without a category (they have no URL here), a page whose slug is
  `blog`, `changelog`, `help`, `roadmap` or `api`, and a blog post or changelog
entry whose slug is `page`, which the site's own routes would hide.

## Troubleshooting

| Error | What it means |
| --- | --- |
| `401 API_KEY_INVALID` | The key is wrong, or it was deleted. Copy it again from **API keys** |
| `403 ORIGIN_NOT_ALLOWED` | A browser request came from a domain missing from **Allowed Origins**. Add it, including `http://localhost` for development |
| `429 RATE_LIMIT_EXCEEDED` | More than the per-minute limit. A build reads up to 20 entries of each type ahead of time; others are built on their first visit |
| `429 MONTHLY_API_LIMIT_EXCEEDED` | The account used its monthly requests. Pages already cached keep being served |

A failed read during `npm run build` fails the build. A failed background rebuild keeps serving
the last good page.

More in the Kookee help center: [API keys and
security](https://kookee.dev/help/account-and-operations/api-keys-and-security),
[webhooks](https://kookee.dev/help/webhooks-and-integrations/send-events-to-your-site-with-webhooks)
and [rate limits and
plans](https://kookee.dev/help/account-and-operations/rate-limits-plans-and-error-handling).

## License

MIT
