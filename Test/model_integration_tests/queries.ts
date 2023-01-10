export const createTablesQuery = `
  CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 (),
    firstName VARCHAR (50) NOT NULL,
    lastName VARCHAR (50),
    points INT,
    gender VARCHAR(50),
    PRIMARY KEY (id)  
  );

  INSERT INTO users (firstName, points, gender) VALUES('user_one', 10, 'F');
  INSERT INTO users (firstName, points, gender) VALUES('user_two', 20, 'M');
  INSERT INTO users (firstName, points, gender) VALUES('user_three', 30, 'F');
  INSERT INTO users (firstName, points, gender) VALUES('user_four', 40, 'M');
  INSERT INTO users (firstName, points, gender) VALUES('user_five', 50, 'F');

  CREATE TABLE teams (
    id serial,
    teamName  VARCHAR (50) NOT NULL,
    teamRole  VARCHAR (50),
    PRIMARY KEY (id)
  );

  INSERT INTO teams (teamName) VALUES('team A');
  INSERT INTO teams (teamName) VALUES('team B');
  
  ALTER TABLE users ADD team_id INT;
  ALTER TABLE users ADD CONSTRAINT fk_team_id FOREIGN KEY (team_id) REFERENCES teams ON DELETE SET NULL ON UPDATE CASCADE;
  
  INSERT INTO users (firstName, points, team_id, gender) VALUES('user_six', 60, 1, 'F');
  INSERT INTO users (firstName, points, team_id, gender) VALUES('user_seven', 70, 2, 'F');
  INSERT INTO users (firstName, points, team_id, gender) VALUES('user_eight', 80, 1, 'M');
`;

export const dropTablesQuery = `
  DROP TABLE users CASCADE;
  DROP TABLE teams CASCADE;
`;
