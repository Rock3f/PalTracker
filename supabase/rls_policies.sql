-- Active RLS sur les 3 tables (si pas déjà fait)
alter table players enable row level security;
alter table player_history enable row level security;
alter table player_objectives enable row level security;

-- players : tout le monde du groupe (authentifié) peut lire tous les profils
-- (nécessaire pour la vue "Groupe"), mais chacun ne peut modifier que le sien.
create policy "players_select_authenticated" on players
  for select using (auth.role() = 'authenticated');

create policy "players_insert_own" on players
  for insert with check (auth.uid() = user_id);

create policy "players_update_own" on players
  for update using (auth.uid() = user_id);

-- player_history : lecture réservée à son propre historique.
-- L'écriture se fait via le trigger (déclenché par l'update sur players),
-- donc pas de policy insert nécessaire côté client.
create policy "history_select_own" on player_history
  for select using (
    exists (select 1 from players p where p.id = player_history.player_id and p.user_id = auth.uid())
  );

-- player_objectives : lecture pour tout le groupe (vue "Groupe" agrège les
-- objectifs de tous les joueurs), écriture seulement sur ses propres objectifs.
create policy "objectives_select_authenticated" on player_objectives
  for select using (auth.role() = 'authenticated');

create policy "objectives_insert_own" on player_objectives
  for insert with check (
    exists (select 1 from players p where p.id = player_objectives.player_id and p.user_id = auth.uid())
  );

create policy "objectives_delete_own" on player_objectives
  for delete using (
    exists (select 1 from players p where p.id = player_objectives.player_id and p.user_id = auth.uid())
  );
