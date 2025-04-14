-- Drop existing policies
drop policy if exists "Enable all operations for authenticated users" on tasks;

-- Create new policies
create policy "Enable read for authenticated users"
on tasks for select
to authenticated
using (true);

create policy "Enable insert for authenticated users"
on tasks for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users"
on tasks for update
to authenticated
using (true);

create policy "Enable delete for authenticated users"
on tasks for delete
to authenticated
using (true); 