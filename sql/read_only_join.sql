-- PostgreSQL demo; entirely synthetic structure and labels.
-- A read-only query combining accounts and events.
SELECT
  a.account_id,
  a.display_name,
  COUNT(e.event_id) AS total_events
FROM demo_accounts AS a
LEFT JOIN demo_events AS e ON e.account_id = a.account_id
WHERE a.is_active = TRUE
GROUP BY a.account_id, a.display_name
ORDER BY total_events DESC, a.account_id;
