SET TIME ZONE 'UTC';

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  discord_id VARCHAR ( 50 ) UNIQUE NOT NULL,
  discord_name VARCHAR ( 50 ),
  discord_discriminator VARCHAR ( 7 ) NOT NULL,
  discord_refresh VARCHAR ( 100 ),
  portals_created INT NOT NULL,
  custom_name VARCHAR ( 50 ),
  created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servers (
  id serial PRIMARY KEY,
  discord_id VARCHAR ( 50 ) UNIQUE NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS server_roles (
  id serial PRIMARY KEY,
  server_id INT UNIQUE NOT NULL,
  discord_role_id VARCHAR ( 50 ) UNIQUE NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_servers (
  user_id INT NOT NULL,
  server_id INT NOT NULL,
  PRIMARY KEY(user_id, server_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

-- Create Portal & Connection Data

CREATE TABLE IF NOT EXISTS portals (
  id serial PRIMARY KEY,
  server_id INT NOT NULL,
  conn1 VARCHAR ( 100 ) NOT NULL,
  conn2 VARCHAR ( 100 ) NOT NULL,
  size VARCHAR ( 20 ) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by INT NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
