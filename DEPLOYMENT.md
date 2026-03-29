# Deployment Info — Huishoud Van Bogaert

## Live App
- **URL**: https://huishoud-app-xi.vercel.app
- **Hosting**: Vercel (Hobby plan, auto-deploys from GitHub `main`)
- **GitHub repo**: https://github.com/OlivierVanBogaert/huishoud-app

## Supabase
- **Project**: huishoud-app
- **Region**: West EU
- **Dashboard**: https://supabase.com/dashboard/project/mqiicmqnqejxmxrcaxfi

### Households
| Naam | UUID |
|------|------|
| Olivier & Ashley | `ada24453-c203-4639-be69-0cdae55df9f4` |
| Jan | `b678cfb5-66be-4a29-8200-7b417e9e7ff5` |

### Users
| Naam | Email | Household(s) |
|------|-------|-------------|
| Olivier | olivier@huishoud.app | Olivier & Ashley |
| Ashley | ashley@huishoud.app | Olivier & Ashley |
| Jan | jan@huishoud.app | Jan |
| Edna | edna@huishoud.app | Olivier & Ashley + Jan |

### Environment Variables (Vercel)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous/public key

## Tech Stack
- React + Vite (JavaScript)
- Supabase (Auth + PostgreSQL + RLS)
- Vercel (Hosting)
