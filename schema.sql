-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Bases table
create table bases (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tables table
create table tables (
  id uuid default uuid_generate_v4() primary key,
  base_id uuid references bases(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table columns
create table table_columns (
  id uuid default uuid_generate_v4() primary key,
  table_id uuid references tables(id) on delete cascade not null,
  name text not null,
  type text not null, -- 'text', 'number', 'date', 'boolean', etc.
  options jsonb default '{}', -- For additional column settings
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table records (rows)
create table table_records (
  id uuid default uuid_generate_v4() primary key,
  table_id uuid references tables(id) on delete cascade not null,
  data jsonb not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index idx_tables_base_id on tables(base_id);
create index idx_table_columns_table_id on table_columns(table_id);
create index idx_table_records_table_id on table_records(table_id);
create index idx_table_columns_order on table_columns(order_index);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updating updated_at
create trigger update_table_records_updated_at
  before update on table_records
  for each row
  execute function update_updated_at_column();

-- RLS (Row Level Security) Policies
alter table bases enable row level security;
alter table tables enable row level security;
alter table table_columns enable row level security;
alter table table_records enable row level security;

-- Create policies (assuming public access for this example)
create policy "Public bases access"
  on bases for all
  using (true);

create policy "Public tables access"
  on tables for all
  using (true);

create policy "Public columns access"
  on table_columns for all
  using (true);

create policy "Public records access"
  on table_records for all
  using (true);
