-- Seed: demo registrations for the admin dashboard (RSVP-4, refreshed for v9)
-- Created: 2026-06-11 · Updated: 2026-07-31
--
-- Four rows covering every stored status, so the admin list and the landing
-- screenshots look intentional on the public portfolio. Attendee-facing flow is
-- unaffected (new registrations keep inserting normally).
--
-- Two pending rows on purpose: the batch bar in the v9 mockup shows two guests
-- selected with Approve / Reject live, and batch actions only apply to rows that
-- have not been reviewed yet. "Reviewed" is a timeline step on the status page,
-- not a stored value — see lib/status.ts.
--
-- EXECUTION: run in Supabase Dashboard SQL Editor AFTER
-- 20260611000000_rsvp4_admin_access.sql (needs the status_updated_at / remark
-- columns). Transactional — any error rolls the whole thing back, so a clean
-- list is never left half-seeded.

begin;

-- Only clear rows this file owns. A blanket `delete from registrations` would
-- also wipe genuine submissions made through /register while testing, which is
-- how a real test row nearly got destroyed on 2026-07-31.
delete from public.registrations where token like 'demo\_%';

insert into public.registrations
  (event_id, name, email, phone, company, token, status, remark, created_at, status_updated_at)
values
  ((select id from public.events order by created_at desc limit 1),
   'Zelda Okonkwo',        'zelda.o@anthropic.com', '0912345678', 'Anthropic',
   'demo_q7Kp2xR9aLmZ3vN8sB1tD', 'pending',  null,
   now() - interval '2 hours', null),

  ((select id from public.events order by created_at desc limit 1),
   'Renata J.',            'rj@example.com',        '0922333444', null,
   'demo_W3rT6yU8iO1pA5sD9fG2hJ', 'pending',  null,
   now() - interval '5 hours', null),

  ((select id from public.events order by created_at desc limit 1),
   'Huckleberry Novak',    'huck.novak@figma.com',  '0933221100', 'Figma',
   'demo_K2jH8gF4dS6aP9oL3kM5nB', 'approved', 'Speaker · front-row seating',
   now() - interval '2 days', now() - interval '1 day'),

  ((select id from public.events order by created_at desc limit 1),
   'Bartholomew Watanabe', 'bart.w@nvidia.com',     '0955667788', 'NVIDIA',
   'demo_P3oI6uY9tR2eW5qA8sD1fG', 'rejected', 'Duplicate registration',
   now() - interval '3 days', now() - interval '2 days');

commit;

-- Verify (read-only): expect 4 seeded rows — 2 pending / 1 approved / 1 rejected.
-- Any extra row is a genuine submission and is meant to still be there.
select status, count(*) from public.registrations
 where token like 'demo\_%'
 group by status order by status;
