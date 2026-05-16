# Admin Dashboard Build Plan

A comprehensive, role-protected admin panel replacing the existing single-page `/admin` route with a multi-page dashboard using a collapsible sidebar layout.

## Database Changes (1 migration)

New tables to support the dashboard:

- **`admin_activity_log`** — stores user actions (signup, trip_created, ai_generated, pdf_exported, profile_updated, login_failed, user_suspended). Columns: `user_id`, `action_type`, `description`, `metadata jsonb`, `created_at`. RLS: admins can view all; system/users can insert their own.
- **`admin_notifications`** — admin-targeted notifications. Columns: `type`, `message`, `metadata jsonb`, `read boolean`, `created_at`. RLS: only admins read/update.
- **`admin_settings`** — single-row feature flags table: `ai_enabled`, `pdf_enabled`, `signups_enabled`. RLS: admin-only.
- **Add to `profiles`**: `status text default 'active'` (active|suspended), `last_active_at timestamptz`.
- **Add to `past_trips`**: `title text`, `status text default 'planned'` (planned|ongoing|completed), `ai_generated boolean default false`, `start_date date`, `end_date date`.

Enable realtime on `admin_activity_log` and `admin_notifications`.

A trigger on `auth.users` insert (extending `handle_new_user`) inserts a signup activity row + notification. Helper RPC `log_activity(action_type, description, metadata)` for client logging.

## Routing & Protection

- New layout `src/pages/admin/AdminLayout.tsx` wrapping all admin routes with role check via `has_role` query. Non-admins → redirect to `/dashboard` with toast.
- Routes added in `App.tsx`:
  - `/admin` → Overview
  - `/admin/users`
  - `/admin/trips`
  - `/admin/activity`
  - `/admin/analytics`
  - `/admin/notifications`
  - `/admin/settings`

## Components

### Layout
- `AdminSidebar.tsx` — shadcn Sidebar with `collapsible="icon"`, 7 nav items with lucide icons, active highlight via `NavLink`.
- `AdminTopbar.tsx` — logo/"Admin Panel" label, `NotificationBell` (Popover with unread count badge, realtime subscription), avatar dropdown (profile, logout).

### Pages
- `Overview.tsx` — 4 stat cards (Total Users, Total Trips, AI Itineraries, PDFs Exported) with 30-day % change, recharts LineChart (signups), BarChart (trips/day), PieChart (trip status).
- `Users.tsx` — searchable/sortable shadcn DataTable with pagination, filters (role/status/date), inline role dropdown, status toggle, click → Sheet slide-over with full profile + trips + activity.
- `Trips.tsx` — table with filters, click → Dialog showing trip details + map preview (reusing `TripMap`).
- `ActivityFeed.tsx` — realtime feed with "New activity" pill, action icons, relative timestamps (date-fns).
- `Analytics.tsx` — date-range selector (7/30/90/all), popular destinations bar, AI usage line, PDF export line, avg trips/user stat, retention stat, Leaflet heatmap of destinations.
- `Notifications.tsx` — full list, mark-as-read, mark-all-read, type icons.
- `Settings.tsx` — admins list with add/remove role, feature flag switches, danger zone (delete user trips, wipe test data) with AlertDialog confirmations.

### Shared
- `StatCard.tsx`, `EmptyState.tsx`, `useAdminRole.ts` hook, `useRealtimeFeed.ts` hook.
- Skeleton loaders for all data fetches; sonner toasts on all mutations; AlertDialog on destructive actions.

## Integrations

- Hook existing flows to log activity:
  - `PlanTrip` → log `trip_created` + `ai_generated` when AI itinerary returned.
  - `TripPDFDownload` → log `pdf_exported`.
  - Profile updates in `Profile.tsx` → log `profile_updated`.

## Out of scope (mocked)
- Supabase storage usage / API call counts in Settings → display "N/A" or static placeholders (not queryable from client).
- Failed login tracking → only logged when explicit error handler fires in `Auth.tsx`.

## Files (high-level)

Created: `AdminLayout.tsx`, `AdminSidebar.tsx`, `AdminTopbar.tsx`, `NotificationBell.tsx`, `pages/admin/Overview.tsx`, `Users.tsx`, `Trips.tsx`, `ActivityFeed.tsx`, `Analytics.tsx`, `Notifications.tsx`, `Settings.tsx`, hooks, shared components.

Modified: `App.tsx` (routes), `pages/Admin.tsx` (redirect to new layout or replace), `PlanTrip.tsx`, `TripPDFDownload.tsx`, `Profile.tsx` (activity logging).

Migration: 1 SQL migration as described above.

## Approval

Reply "approve" to proceed, or tell me what to adjust (e.g., skip heatmap, simplify Settings, drop activity logging hooks).
