-- Profiles Table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  balance numeric default 0.00,
  account_status text default 'Standard',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Services Table
create table if not exists services (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  name text not null,
  rate numeric not null, -- cost per 1000
  min text not null,
  max text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  service_id uuid references services(id) not null,
  link text not null,
  quantity integer not null,
  charge numeric not null,
  status text default 'Pending' not null, -- Pending, In Progress, Completed, Canceled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions/Funds Table
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  amount numeric not null,
  payment_method text not null,
  status text default 'Completed' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert dummy services for testing
insert into services (category, name, rate, min, max) values 
('Instagram', 'Instagram Followers [HQ]', 120.00, '10', '10000'),
('Instagram', 'Instagram Likes [Fast]', 20.00, '50', '50000'),
('TikTok', 'TikTok Views [Instant]', 1.50, '1000', '1000000'),
('TikTok', 'TikTok Followers', 150.00, '100', '5000');

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table services enable row level security;
alter table orders enable row level security;
alter table transactions enable row level security;

-- Policies
create policy "Public services are viewable by everyone."
  on services for select
  using ( true );

create policy "Users can view their own profile."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can view their own orders."
  on orders for select
  using ( auth.uid() = user_id );

create policy "Users can create their own orders."
  on orders for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own transactions."
  on transactions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own transactions."
  on transactions for insert
  with check ( auth.uid() = user_id );

-- Function to handle new user signup and create a profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, balance)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 0.00);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
