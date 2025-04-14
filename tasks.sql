-- Create the tasks table
create table if not exists tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  type text not null check (type in ('Shipment', 'Invoice', 'Payment', 'Custom')),
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null check (status in ('pending', 'in-progress', 'completed')),
  due_date text not null,
  assigned_to text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Additional fields
  origin text,
  destination text,
  shipment_type text check (shipment_type in ('Air', 'Sea', 'Land')),
  weight text,
  amount text,
  client_name text,
  invoice_number text,
  payment_method text check (payment_method in ('Credit Card', 'Bank Transfer', 'Cash')),
  reference text
);

-- Enable Row Level Security (RLS)
alter table tasks enable row level security;

-- Drop existing policy if it exists
drop policy if exists "Enable all operations for authenticated users" on tasks;

-- Create a policy that allows all operations for authenticated users
create policy "Enable all operations for authenticated users" on tasks
  for all
  to authenticated
  using (true)
  with check (true);

-- Drop existing trigger if it exists
drop trigger if exists handle_updated_at on tasks;
drop function if exists handle_updated_at();

-- Create an updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
  before update on tasks
  for each row
  execute function handle_updated_at(); 