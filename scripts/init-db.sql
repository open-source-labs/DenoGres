CREATE TABLE public.people (
	"_id" serial NOT NULL,
	"name" varchar NOT NULL,
	"mass" varchar,
	"hair_color" varchar,
	"skin_color" varchar,
	"eye_color" varchar,
	"birth_year" varchar,
	"gender" varchar,
	"species_id" bigint,
	"homeworld_id" bigint,
	"height" integer,
	CONSTRAINT "people_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.films (
	"_id" serial NOT NULL,
	"title" varchar NOT NULL,
	"episode_id" integer NOT NULL,
	"opening_crawl" varchar NOT NULL,
	"director" varchar NOT NULL,
	"producer" varchar NOT NULL,
	"release_date" DATE NOT NULL,
	CONSTRAINT "films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.people_in_films (
	"_id" serial NOT NULL,
	"person_id" bigint NOT NULL,
	"film_id" bigint NOT NULL,
	CONSTRAINT "people_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.planets (
	"_id" serial NOT NULL,
	"name" varchar,
	"rotation_period" integer,
	"orbital_period" integer,
	"diameter" integer,
	"climate" varchar,
	"gravity" varchar,
	"terrain" varchar,
	"surface_water" varchar,
	"population" bigint,
	CONSTRAINT "planets_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.species (
	"_id" serial NOT NULL,
	"name" varchar NOT NULL,
	"classification" varchar,
	"average_height" varchar,
	"average_lifespan" varchar,
	"hair_colors" varchar,
	"skin_colors" varchar,
	"eye_colors" varchar,
	"language" varchar,
	"homeworld_id" bigint,
	CONSTRAINT "species_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.vessels (
	"_id" serial NOT NULL,
	"name" varchar NOT NULL,
	"manufacturer" varchar,
	"model" varchar,
	"vessel_type" varchar NOT NULL,
	"vessel_class" varchar NOT NULL,
	"cost_in_credits" bigint,
	"length" varchar,
	"max_atmosphering_speed" varchar,
	"crew" integer,
	"passengers" integer,
	"cargo_capacity" varchar,
	"consumables" varchar,
	CONSTRAINT "vessels_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.species_in_films (
	"_id" serial NOT NULL,
	"film_id" bigint NOT NULL,
	"species_id" bigint NOT NULL,
	CONSTRAINT "species_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.planets_in_films (
	"_id" serial NOT NULL,
	"film_id" bigint NOT NULL,
	"planet_id" bigint NOT NULL,
	CONSTRAINT "planets_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.pilots (
	"_id" serial NOT NULL,
	"person_id" bigint NOT NULL,
	"vessel_id" bigint NOT NULL,
	CONSTRAINT "pilots_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.vessels_in_films (
	"_id" serial NOT NULL,
	"vessel_id" bigint NOT NULL,
	"film_id" bigint NOT NULL,
	CONSTRAINT "vessels_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE  public.starship_specs (
	"_id" serial NOT NULL,
	"hyperdrive_rating" varchar,
	"MGLT" varchar,
	"vessel_id" bigint NOT NULL,
	CONSTRAINT "starship_specs_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE public.people ADD CONSTRAINT "people_fk0" FOREIGN KEY ("species_id") REFERENCES  public.species("_id");
ALTER TABLE public.people ADD CONSTRAINT "people_fk1" FOREIGN KEY ("homeworld_id") REFERENCES  public.planets("_id");


ALTER TABLE  public.people_in_films ADD CONSTRAINT "people_in_films_fk0" FOREIGN KEY ("person_id") REFERENCES public.people("_id");
ALTER TABLE  public.people_in_films ADD CONSTRAINT "people_in_films_fk1" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");


ALTER TABLE  public.species ADD CONSTRAINT "species_fk0" FOREIGN KEY ("homeworld_id") REFERENCES  public.planets("_id");


ALTER TABLE  public.species_in_films ADD CONSTRAINT "species_in_films_fk0" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");
ALTER TABLE  public.species_in_films ADD CONSTRAINT "species_in_films_fk1" FOREIGN KEY ("species_id") REFERENCES  public.species("_id");

ALTER TABLE  public.planets_in_films ADD CONSTRAINT "planets_in_films_fk0" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");
ALTER TABLE  public.planets_in_films ADD CONSTRAINT "planets_in_films_fk1" FOREIGN KEY ("planet_id") REFERENCES  public.planets("_id");

ALTER TABLE  public.pilots ADD CONSTRAINT "pilots_fk0" FOREIGN KEY ("person_id") REFERENCES public.people("_id");
ALTER TABLE  public.pilots ADD CONSTRAINT "pilots_fk1" FOREIGN KEY ("vessel_id") REFERENCES  public.vessels("_id");

ALTER TABLE  public.vessels_in_films ADD CONSTRAINT "vessels_in_films_fk0" FOREIGN KEY ("vessel_id") REFERENCES  public.vessels("_id");
ALTER TABLE  public.vessels_in_films ADD CONSTRAINT "vessels_in_films_fk1" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");

ALTER TABLE  public.starship_specs ADD CONSTRAINT "starship_specs_fk0" FOREIGN KEY ("vessel_id") REFERENCES  public.vessels("_id");



--
-- TOC entry 4120 (class 0 OID 4163856)
-- Dependencies: 225
-- Data for Name: films; Type: TABLE DATA; Schema:  Owner: -
--

INSERT INTO public.films VALUES (1, 'A New Hope', 4, 'It is a period of civil war.
Rebel spaceships, striking
from a hidden base, have won
their first victory against
the evil Galactic Empire.

During the battle, Rebel
spies managed to steal secret
plans to the Empire''s
ultimate weapon, the DEATH
STAR, an armored space
station with enough power
to destroy an entire planet.

Pursued by the Empire''s
sinister agents, Princess
Leia races home aboard her
starship, custodian of the
stolen plans that can save her
people and restore
freedom to the galaxy....', 'George Lucas', 'Gary Kurtz, Rick McCallum', '1977-05-25');
INSERT INTO public.films VALUES (5, 'Attack of the Clones', 2, 'There is unrest in the Galactic
Senate. Several thousand solar
systems have declared their
intentions to leave the Republic.

This separatist movement,
under the leadership of the
mysterious Count Dooku, has
made it difficult for the limited
number of Jedi Knights to maintain 
peace and order in the galaxy.

Senator Amidala, the former
Queen of Naboo, is returning
to the Galactic Senate to vote
on the critical issue of creating
an ARMY OF THE REPUBLIC
to assist the overwhelmed
Jedi....', 'George Lucas', 'Rick McCallum', '2002-05-16');
INSERT INTO public.films VALUES (4, 'The Phantom Menace', 1, 'Turmoil has engulfed the
Galactic Republic. The taxation
of trade routes to outlying star
systems is in dispute.

Hoping to resolve the matter
with a blockade of deadly
battleships, the greedy Trade
Federation has stopped all
shipping to the small planet
of Naboo.

While the Congress of the
Republic endlessly debates
this alarming chain of events,
the Supreme Chancellor has
secretly dispatched two Jedi
Knights, the guardians of
peace and justice in the
galaxy, to settle the conflict....', 'George Lucas', 'Rick McCallum', '1999-05-19');
INSERT INTO public.films VALUES (6, 'Revenge of the Sith', 3, 'War! The Republic is crumbling
under attacks by the ruthless
Sith Lord, Count Dooku.
There are heroes on both sides.
Evil is everywhere.

In a stunning move, the
fiendish droid leader, General
Grievous, has swept into the
Republic capital and kidnapped
Chancellor Palpatine, leader of
the Galactic Senate.

As the Separatist Droid Army
attempts to flee the besieged
capital with their valuable
hostage, two Jedi Knights lead a
desperate mission to rescue the
captive Chancellor....', 'George Lucas', 'Rick McCallum', '2005-05-19');
INSERT INTO public.films VALUES (3, 'Return of the Jedi', 6, 'Luke Skywalker has returned to
his home planet of Tatooine in
an attempt to rescue his
friend Han Solo from the
clutches of the vile gangster
Jabba the Hutt.

Little does Luke know that the
GALACTIC EMPIRE has secretly
begun construction on a new
armored space station even
more powerful than the first
dreaded Death Star.

When completed, this ultimate
weapon will spell certain doom
for the small band of rebels
struggling to restore freedom
to the galaxy...', 'Richard Marquand', 'Howard G. Kazanjian, George Lucas, Rick McCallum', '1983-05-25');
INSERT INTO public.films VALUES (2, 'The Empire Strikes Back', 5, 'It is a dark time for the
Rebellion. Although the Death
Star has been destroyed,
Imperial troops have driven the
Rebel forces from their hidden
base and pursued them across
the galaxy.

Evading the dreaded Imperial
Starfleet, a group of freedom
fighters led by Luke Skywalker
has established a new secret
base on the remote ice world
of Hoth.

The evil lord Darth Vader,
obsessed with finding young
Skywalker, has dispatched
thousands of remote probes into
the far reaches of space....', 'Irvin Kershner', 'Gary Kurtz, Rick McCallum', '1980-05-17');
INSERT INTO public.films VALUES (7, 'The Force Awakens', 7, 'Luke Skywalker has vanished.
In his absence, the sinister
FIRST ORDER has risen from
the ashes of the Empire
and will not rest until
Skywalker, the last Jedi,
has been destroyed.
 
With the support of the
REPUBLIC, General Leia Organa
leads a brave RESISTANCE.
She is desperate to find her
brother Luke and gain his
help in restoring peace and
justice to the galaxy.
 
Leia has sent her most daring
pilot on a secret mission
to Jakku, where an old ally
has discovered a clue to
Luke''s whereabouts....', 'J. J. Abrams', 'Kathleen Kennedy, J. J. Abrams, Bryan Burk', '2015-12-11');


--
-- TOC entry 4124 (class 0 OID 4163875)
-- Dependencies: 229
-- Data for Name: planets; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.planets VALUES (2, 'Alderaan', 24, 364, 12500, 'temperate', '1 standard', 'grasslands, mountains', '40', 2000000000);
 INSERT INTO public.planets VALUES (3, 'Yavin IV', 24, 4818, 10200, 'temperate, tropical', '1 standard', 'jungle, rainforests', '8', 1000);
 INSERT INTO public.planets VALUES (4, 'Hoth', 23, 549, 7200, 'frozen', '1.1 standard', 'tundra, ice caves, mountain ranges', '100', NULL);
 INSERT INTO public.planets VALUES (5, 'Dagobah', 23, 341, 8900, 'murky', 'N/A', 'swamp, jungles', '8', NULL);
 INSERT INTO public.planets VALUES (6, 'Bespin', 12, 5110, 118000, 'temperate', '1.5 (surface), 1 standard (Cloud City)', 'gas giant', '0', 6000000);
 INSERT INTO public.planets VALUES (7, 'Endor', 18, 402, 4900, 'temperate', '0.85 standard', 'forests, mountains, lakes', '8', 30000000);
 INSERT INTO public.planets VALUES (8, 'Naboo', 26, 312, 12120, 'temperate', '1 standard', 'grassy hills, swamps, forests, mountains', '12', 4500000000);
 INSERT INTO public.planets VALUES (9, 'Coruscant', 24, 368, 12240, 'temperate', '1 standard', 'cityscape, mountains', NULL, 1000000000000);
 INSERT INTO public.planets VALUES (10, 'Kamino', 27, 463, 19720, 'temperate', '1 standard', 'ocean', '100', 1000000000);
 INSERT INTO public.planets VALUES (11, 'Geonosis', 30, 256, 11370, 'temperate, arid', '0.9 standard', 'rock, desert, mountain, barren', '5', 100000000000);
 INSERT INTO public.planets VALUES (12, 'Utapau', 27, 351, 12900, 'temperate, arid, windy', '1 standard', 'scrublands, savanna, canyons, sinkholes', '0.9', 95000000);
 INSERT INTO public.planets VALUES (13, 'Mustafar', 36, 412, 4200, 'hot', '1 standard', 'volcanoes, lava rivers, mountains, caves', '0', 20000);
 INSERT INTO public.planets VALUES (14, 'Kashyyyk', 26, 381, 12765, 'tropical', '1 standard', 'jungle, forests, lakes, rivers', '60', 45000000);
 INSERT INTO public.planets VALUES (15, 'Polis Massa', 24, 590, 0, 'artificial temperate ', '0.56 standard', 'airless asteroid', '0', 1000000);
 INSERT INTO public.planets VALUES (16, 'Mygeeto', 12, 167, 10088, 'frigid', '1 standard', 'glaciers, mountains, ice canyons', NULL, 19000000);
 INSERT INTO public.planets VALUES (17, 'Felucia', 34, 231, 9100, 'hot, humid', '0.75 standard', 'fungus forests', NULL, 8500000);
 INSERT INTO public.planets VALUES (18, 'Cato Neimoidia', 25, 278, 0, 'temperate, moist', '1 standard', 'mountains, fields, forests, rock arches', NULL, 10000000);
 INSERT INTO public.planets VALUES (19, 'Saleucami', 26, 392, 14920, 'hot', NULL, 'caves, desert, mountains, volcanoes', NULL, 1400000000);
 INSERT INTO public.planets VALUES (20, 'Stewjon', NULL, NULL, 0, 'temperate', '1 standard', 'grass', NULL, NULL);
 INSERT INTO public.planets VALUES (21, 'Eriadu', 24, 360, 13490, 'polluted', '1 standard', 'cityscape', NULL, 22000000000);
 INSERT INTO public.planets VALUES (22, 'Corellia', 25, 329, 11000, 'temperate', '1 standard', 'plains, urban, hills, forests', '70', 3000000000);
 INSERT INTO public.planets VALUES (23, 'Rodia', 29, 305, 7549, 'hot', '1 standard', 'jungles, oceans, urban, swamps', '60', 1300000000);
 INSERT INTO public.planets VALUES (24, 'Nal Hutta', 87, 413, 12150, 'temperate', '1 standard', 'urban, oceans, swamps, bogs', NULL, 7000000000);
 INSERT INTO public.planets VALUES (25, 'Dantooine', 25, 378, 9830, 'temperate', '1 standard', 'oceans, savannas, mountains, grasslands', NULL, 1000);
 INSERT INTO public.planets VALUES (26, 'Bestine IV', 26, 680, 6400, 'temperate', NULL, 'rocky islands, oceans', '98', 62000000);
 INSERT INTO public.planets VALUES (27, 'Ord Mantell', 26, 334, 14050, 'temperate', '1 standard', 'plains, seas, mesas', '10', 4000000000);
 INSERT INTO public.planets VALUES (28, 'Hosnian Prime', 0, 0, 0, NULL, NULL, NULL, NULL, NULL);
 INSERT INTO public.planets VALUES (29, 'Trandosha', 25, 371, 0, 'arid', '0.62 standard', 'mountains, seas, grasslands, deserts', NULL, 42000000);
 INSERT INTO public.planets VALUES (30, 'Socorro', 20, 326, 0, 'arid', '1 standard', 'deserts, mountains', NULL, 300000000);
 INSERT INTO public.planets VALUES (31, 'Mon Cala', 21, 398, 11030, 'temperate', '1', 'oceans, reefs, islands', '100', 27000000000);
 INSERT INTO public.planets VALUES (32, 'Chandrila', 20, 368, 13500, 'temperate', '1', 'plains, forests', '40', 1200000000);
 INSERT INTO public.planets VALUES (33, 'Sullust', 20, 263, 12780, 'superheated', '1', 'mountains, volcanoes, rocky deserts', '5', 18500000000);
 INSERT INTO public.planets VALUES (34, 'Toydaria', 21, 184, 7900, 'temperate', '1', 'swamps, lakes', NULL, 11000000);
 INSERT INTO public.planets VALUES (35, 'Malastare', 26, 201, 18880, 'arid, temperate, tropical', '1.56', 'swamps, deserts, jungles, mountains', NULL, 2000000000);
 INSERT INTO public.planets VALUES (36, 'Dathomir', 24, 491, 10480, 'temperate', '0.9', 'forests, deserts, savannas', NULL, 5200);
 INSERT INTO public.planets VALUES (37, 'Ryloth', 30, 305, 10600, 'temperate, arid, subartic', '1', 'mountains, valleys, deserts, tundra', '5', 1500000000);
 INSERT INTO public.planets VALUES (38, 'Aleen Minor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
 INSERT INTO public.planets VALUES (39, 'Vulpter', 22, 391, 14900, 'temperate, artic', '1', 'urban, barren', NULL, 421000000);
 INSERT INTO public.planets VALUES (40, 'Troiken', NULL, NULL, NULL, NULL, NULL, 'desert, tundra, rainforests, mountains', NULL, NULL);
 INSERT INTO public.planets VALUES (41, 'Tund', 48, 1770, 12190, NULL, NULL, 'barren, ash', NULL, 0);
 INSERT INTO public.planets VALUES (42, 'Haruun Kal', 25, 383, 10120, 'temperate', '0.98', 'toxic cloudsea, plateaus, volcanoes', NULL, 705300);
 INSERT INTO public.planets VALUES (43, 'Cerea', 27, 386, NULL, 'temperate', '1', 'verdant', '20', 450000000);
 INSERT INTO public.planets VALUES (44, 'Glee Anselm', 33, 206, 15600, 'tropical, temperate', '1', 'lakes, islands, swamps, seas', '80', 500000000);
 INSERT INTO public.planets VALUES (45, 'Iridonia', 29, 413, NULL, NULL, NULL, 'rocky canyons, acid pools', NULL, NULL);
 INSERT INTO public.planets VALUES (46, 'Tholoth', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
 INSERT INTO public.planets VALUES (47, 'Iktotch', 22, 481, NULL, 'arid, rocky, windy', '1', 'rocky', NULL, NULL);
 INSERT INTO public.planets VALUES (48, 'Quermia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
 INSERT INTO public.planets VALUES (49, 'Dorin', 22, 409, 13400, 'temperate', '1', NULL, NULL, NULL);
 INSERT INTO public.planets VALUES (50, 'Champala', 27, 318, NULL, 'temperate', '1', 'oceans, rainforests, plateaus', NULL, 3500000000);
 INSERT INTO public.planets VALUES (51, 'Mirial', NULL, NULL, NULL, NULL, NULL, 'deserts', NULL, NULL);
 INSERT INTO public.planets VALUES (52, 'Serenno', NULL, NULL, NULL, NULL, NULL, 'rainforests, rivers, mountains', NULL, NULL);
 INSERT INTO public.planets VALUES (53, 'Concord Dawn', NULL, NULL, NULL, NULL, NULL, 'jungles, forests, deserts', NULL, NULL);
 INSERT INTO public.planets VALUES (54, 'Zolan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
 INSERT INTO public.planets VALUES (55, 'Ojom', NULL, NULL, NULL, 'frigid', NULL, 'oceans, glaciers', '100', 500000000);
 INSERT INTO public.planets VALUES (56, 'Skako', 27, 384, NULL, 'temperate', '1', 'urban, vines', NULL, 500000000000);
 INSERT INTO public.planets VALUES (57, 'Muunilinst', 28, 412, 13800, 'temperate', '1', 'plains, forests, hills, mountains', '25', 5000000000);
 INSERT INTO public.planets VALUES (58, 'Shili', NULL, NULL, NULL, 'temperate', '1', 'cities, savannahs, seas, plains', NULL, NULL);
 INSERT INTO public.planets VALUES (59, 'Kalee', 23, 378, 13850, 'arid, temperate, tropical', '1', 'rainforests, cliffs, canyons, seas', NULL, 4000000000);
 INSERT INTO public.planets VALUES (60, 'Umbara', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
 INSERT INTO public.planets VALUES (1, 'Tatooine', 23, 304, 10465, 'arid', '1 standard', 'desert', '1', 200000);
 INSERT INTO public.planets VALUES (61, 'Jakku', NULL, NULL, NULL, NULL, NULL, 'deserts', NULL, NULL);

--
-- TOC entry 4126 (class 0 OID 4163886)
-- Dependencies: 231
-- Data for Name: species; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.species VALUES (5, 'Hutt', 'gastropod', '300', '1000', 'n/a', 'green, brown, tan', 'yellow, red', 'Huttese', 24);
 INSERT INTO public.species VALUES (6, 'Yoda''s species', 'mammal', '66', '900', 'brown, white', 'green, yellow', 'brown, green, yellow', 'Galactic basic', 28);
 INSERT INTO public.species VALUES (7, 'Trandoshan', 'reptile', '200', 'unknown', 'none', 'brown, green', 'yellow, orange', 'Dosh', 29);
 INSERT INTO public.species VALUES (8, 'Mon Calamari', 'amphibian', '160', 'unknown', 'none', 'red, blue, brown, magenta', 'yellow', 'Mon Calamarian', 31);
 INSERT INTO public.species VALUES (9, 'Ewok', 'mammal', '100', 'unknown', 'white, brown, black', 'brown', 'orange, brown', 'Ewokese', 7);
 INSERT INTO public.species VALUES (10, 'Sullustan', 'mammal', '180', 'unknown', 'none', 'pale', 'black', 'Sullutese', 33);
 INSERT INTO public.species VALUES (11, 'Neimodian', 'unknown', '180', 'unknown', 'none', 'grey, green', 'red, pink', 'Neimoidia', 18);
 INSERT INTO public.species VALUES (12, 'Gungan', 'amphibian', '190', 'unknown', 'none', 'brown, green', 'orange', 'Gungan basic', 8);
 INSERT INTO public.species VALUES (13, 'Toydarian', 'mammal', '120', '91', 'none', 'blue, green, grey', 'yellow', 'Toydarian', 34);
 INSERT INTO public.species VALUES (14, 'Dug', 'mammal', '100', 'unknown', 'none', 'brown, purple, grey, red', 'yellow, blue', 'Dugese', 35);
 INSERT INTO public.species VALUES (15, 'Twi''lek', 'mammals', '200', 'unknown', 'none', 'orange, yellow, blue, green, pink, purple, tan', 'blue, brown, orange, pink', 'Twi''leki', 37);
 INSERT INTO public.species VALUES (16, 'Aleena', 'reptile', '80', '79', 'none', 'blue, gray', 'unknown', 'Aleena', 38);
 INSERT INTO public.species VALUES (17, 'Vulptereen', 'unknown', '100', 'unknown', 'none', 'grey', 'yellow', 'vulpterish', 39);
 INSERT INTO public.species VALUES (18, 'Xexto', 'unknown', '125', 'unknown', 'none', 'grey, yellow, purple', 'black', 'Xextese', 40);
 INSERT INTO public.species VALUES (19, 'Toong', 'unknown', '200', 'unknown', 'none', 'grey, green, yellow', 'orange', 'Tundan', 41);
 INSERT INTO public.species VALUES (20, 'Cerean', 'mammal', '200', 'unknown', 'red, blond, black, white', 'pale pink', 'hazel', 'Cerean', 43);
 INSERT INTO public.species VALUES (21, 'Nautolan', 'amphibian', '180', '70', 'none', 'green, blue, brown, red', 'black', 'Nautila', 44);
 INSERT INTO public.species VALUES (22, 'Zabrak', 'mammal', '180', 'unknown', 'black', 'pale, brown, red, orange, yellow', 'brown, orange', 'Zabraki', 45);
 INSERT INTO public.species VALUES (23, 'Tholothian', 'mammal', 'unknown', 'unknown', 'unknown', 'dark', 'blue, indigo', 'unknown', 46);
 INSERT INTO public.species VALUES (24, 'Iktotchi', 'unknown', '180', 'unknown', 'none', 'pink', 'orange', 'Iktotchese', 47);
 INSERT INTO public.species VALUES (25, 'Quermian', 'mammal', '240', '86', 'none', 'white', 'yellow', 'Quermian', 48);
 INSERT INTO public.species VALUES (26, 'Kel Dor', 'unknown', '180', '70', 'none', 'peach, orange, red', 'black, silver', 'Kel Dor', 49);
 INSERT INTO public.species VALUES (27, 'Chagrian', 'amphibian', '190', 'unknown', 'none', 'blue', 'blue', 'Chagria', 50);
 INSERT INTO public.species VALUES (28, 'Geonosian', 'insectoid', '178', 'unknown', 'none', 'green, brown', 'green, hazel', 'Geonosian', 11);
 INSERT INTO public.species VALUES (29, 'Mirialan', 'mammal', '180', 'unknown', 'black, brown', 'yellow, green', 'blue, green, red, yellow, brown, orange', 'Mirialan', 51);
 INSERT INTO public.species VALUES (30, 'Clawdite', 'reptilian', '180', '70', 'none', 'green, yellow', 'yellow', 'Clawdite', 54);
 INSERT INTO public.species VALUES (31, 'Besalisk', 'amphibian', '178', '75', 'none', 'brown', 'yellow', 'besalisk', 55);
 INSERT INTO public.species VALUES (32, 'Kaminoan', 'amphibian', '220', '80', 'none', 'grey, blue', 'black', 'Kaminoan', 10);
 INSERT INTO public.species VALUES (33, 'Skakoan', 'mammal', 'unknown', 'unknown', 'none', 'grey, green', 'unknown', 'Skakoan', 56);
 INSERT INTO public.species VALUES (34, 'Muun', 'mammal', '190', '100', 'none', 'grey, white', 'black', 'Muun', 57);
 INSERT INTO public.species VALUES (35, 'Togruta', 'mammal', '180', '94', 'none', 'red, white, orange, yellow, green, blue', 'red, orange, yellow, green, blue, black', 'Togruti', 58);
 INSERT INTO public.species VALUES (36, 'Kaleesh', 'reptile', '170', '80', 'none', 'brown, orange, tan', 'yellow', 'Kaleesh', 59);
 INSERT INTO public.species VALUES (37, 'Pau''an', 'mammal', '190', '700', 'none', 'grey', 'black', 'Utapese', 12);
 INSERT INTO public.species VALUES (3, 'Wookiee', 'mammal', '210', '400', 'black, brown', 'gray', 'blue, green, yellow, brown, golden, red', 'Shyriiwook', 14);
 INSERT INTO public.species VALUES (2, 'Droid', 'artificial', 'n/a', 'indefinite', 'n/a', 'n/a', 'n/a', 'n/a', NULL);
 INSERT INTO public.species VALUES (1, 'Human', 'mammal', '180', '120', 'blonde, brown, black, red', 'caucasian, black, asian, hispanic', 'brown, blue, green, hazel, grey, amber', 'Galactic Basic', 9);
 INSERT INTO public.species VALUES (4, 'Rodian', 'sentient', '170', 'unknown', 'n/a', 'green, blue', 'black', 'Galactic Basic', 23);


--
-- TOC entry 4118 (class 0 OID 4163845)
-- Dependencies: 223
-- Data for Name: people; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.people VALUES (1, 'Luke Skywalker', '77', 'blond', 'fair', 'blue', '19BBY', 'male', 1, 1, 172);
 INSERT INTO public.people VALUES (2, 'C-3PO', '75', 'n/a', 'gold', 'yellow', '112BBY', 'n/a', 2, 1, 167);
 INSERT INTO public.people VALUES (3, 'R2-D2', '32', 'n/a', 'white, blue', 'red', '33BBY', 'n/a', 2, 8, 96);
 INSERT INTO public.people VALUES (4, 'Darth Vader', '136', 'none', 'white', 'yellow', '41.9BBY', 'male', 1, 1, 202);
 INSERT INTO public.people VALUES (5, 'Leia Organa', '49', 'brown', 'light', 'brown', '19BBY', 'female', 1, 2, 150);
 INSERT INTO public.people VALUES (6, 'Owen Lars', '120', 'brown, grey', 'light', 'blue', '52BBY', 'male', 1, 1, 178);
 INSERT INTO public.people VALUES (7, 'Beru Whitesun lars', '75', 'brown', 'light', 'blue', '47BBY', 'female', 1, 1, 165);
 INSERT INTO public.people VALUES (8, 'R5-D4', '32', 'n/a', 'white, red', 'red', NULL, 'n/a', 2, 1, 97);
 INSERT INTO public.people VALUES (9, 'Biggs Darklighter', '84', 'black', 'light', 'brown', '24BBY', 'male', 1, 1, 183);
 INSERT INTO public.people VALUES (10, 'Obi-Wan Kenobi', '77', 'auburn, white', 'fair', 'blue-gray', '57BBY', 'male', 1, 20, 182);
 INSERT INTO public.people VALUES (11, 'Anakin Skywalker', '84', 'blond', 'fair', 'blue', '41.9BBY', 'male', 1, 1, 188);
 INSERT INTO public.people VALUES (12, 'Wilhuff Tarkin', NULL, 'auburn, grey', 'fair', 'blue', '64BBY', 'male', 1, 21, 180);
 INSERT INTO public.people VALUES (13, 'Chewbacca', '112', 'brown', NULL, 'blue', '200BBY', 'male', 3, 14, 228);
 INSERT INTO public.people VALUES (14, 'Han Solo', '80', 'brown', 'fair', 'brown', '29BBY', 'male', 1, 22, 180);
 INSERT INTO public.people VALUES (15, 'Greedo', '74', 'n/a', 'green', 'black', '44BBY', 'male', 4, 23, 173);
 INSERT INTO public.people VALUES (16, 'Jabba Desilijic Tiure', '1,358', 'n/a', 'green-tan, brown', 'orange', '600BBY', 'hermaphrodite', 5, 24, 175);
 INSERT INTO public.people VALUES (18, 'Wedge Antilles', '77', 'brown', 'fair', 'hazel', '21BBY', 'male', 1, 22, 170);
 INSERT INTO public.people VALUES (19, 'Jek Tono Porkins', '110', 'brown', 'fair', 'blue', NULL, 'male', 1, 26, 180);
 INSERT INTO public.people VALUES (20, 'Yoda', '17', 'white', 'green', 'brown', '896BBY', 'male', 6, 28, 66);
 INSERT INTO public.people VALUES (21, 'Palpatine', '75', 'grey', 'pale', 'yellow', '82BBY', 'male', 1, 8, 170);
 INSERT INTO public.people VALUES (22, 'Boba Fett', '78.2', 'black', 'fair', 'brown', '31.5BBY', 'male', 1, 10, 183);
 INSERT INTO public.people VALUES (23, 'IG-88', '140', 'none', 'metal', 'red', '15BBY', 'none', 2, 28, 200);
 INSERT INTO public.people VALUES (24, 'Bossk', '113', 'none', 'green', 'red', '53BBY', 'male', 7, 29, 190);
 INSERT INTO public.people VALUES (25, 'Lando Calrissian', '79', 'black', 'dark', 'brown', '31BBY', 'male', 1, 30, 177);
 INSERT INTO public.people VALUES (26, 'Lobot', '79', 'none', 'light', 'blue', '37BBY', 'male', 1, 6, 175);
 INSERT INTO public.people VALUES (27, 'Ackbar', '83', 'none', 'brown mottle', 'orange', '41BBY', 'male', 8, 31, 180);
 INSERT INTO public.people VALUES (28, 'Mon Mothma', NULL, 'auburn', 'fair', 'blue', '48BBY', 'female', 1, 32, 150);
 INSERT INTO public.people VALUES (29, 'Arvel Crynyd', NULL, 'brown', 'fair', 'brown', NULL, 'male', 1, 28, NULL);
 INSERT INTO public.people VALUES (30, 'Wicket Systri Warrick', '20', 'brown', 'brown', 'brown', '8BBY', 'male', 9, 7, 88);
 INSERT INTO public.people VALUES (31, 'Nien Nunb', '68', 'none', 'grey', 'black', NULL, 'male', 10, 33, 160);
 INSERT INTO public.people VALUES (32, 'Qui-Gon Jinn', '89', 'brown', 'fair', 'blue', '92BBY', 'male', 1, 28, 193);
 INSERT INTO public.people VALUES (33, 'Nute Gunray', '90', 'none', 'mottled green', 'red', NULL, 'male', 11, 18, 191);
 INSERT INTO public.people VALUES (34, 'Finis Valorum', NULL, 'blond', 'fair', 'blue', '91BBY', 'male', 1, 9, 170);
 INSERT INTO public.people VALUES (36, 'Jar Jar Binks', '66', 'none', 'orange', 'orange', '52BBY', 'male', 12, 8, 196);
 INSERT INTO public.people VALUES (37, 'Roos Tarpals', '82', 'none', 'grey', 'orange', NULL, 'male', 12, 8, 224);
 INSERT INTO public.people VALUES (38, 'Rugor Nass', NULL, 'none', 'green', 'orange', NULL, 'male', 12, 8, 206);
 INSERT INTO public.people VALUES (39, 'Ric Olié', NULL, 'brown', 'fair', 'blue', NULL, 'male', NULL, 8, 183);
 INSERT INTO public.people VALUES (40, 'Watto', NULL, 'black', 'blue, grey', 'yellow', NULL, 'male', 13, 34, 137);
 INSERT INTO public.people VALUES (41, 'Sebulba', '40', 'none', 'grey, red', 'orange', NULL, 'male', 14, 35, 112);
 INSERT INTO public.people VALUES (42, 'Quarsh Panaka', NULL, 'black', 'dark', 'brown', '62BBY', 'male', NULL, 8, 183);
 INSERT INTO public.people VALUES (43, 'Shmi Skywalker', NULL, 'black', 'fair', 'brown', '72BBY', 'female', 1, 1, 163);
 INSERT INTO public.people VALUES (44, 'Darth Maul', '80', 'none', 'red', 'yellow', '54BBY', 'male', 22, 36, 175);
 INSERT INTO public.people VALUES (45, 'Bib Fortuna', NULL, 'none', 'pale', 'pink', NULL, 'male', 15, 37, 180);
 INSERT INTO public.people VALUES (46, 'Ayla Secura', '55', 'none', 'blue', 'hazel', '48BBY', 'female', 15, 37, 178);
 INSERT INTO public.people VALUES (48, 'Dud Bolt', '45', 'none', 'blue, grey', 'yellow', NULL, 'male', 17, 39, 94);
 INSERT INTO public.people VALUES (49, 'Gasgano', NULL, 'none', 'white, blue', 'black', NULL, 'male', 18, 40, 122);
 INSERT INTO public.people VALUES (50, 'Ben Quadinaros', '65', 'none', 'grey, green, yellow', 'orange', NULL, 'male', 19, 41, 163);
 INSERT INTO public.people VALUES (51, 'Mace Windu', '84', 'none', 'dark', 'brown', '72BBY', 'male', 1, 42, 188);
 INSERT INTO public.people VALUES (52, 'Ki-Adi-Mundi', '82', 'white', 'pale', 'yellow', '92BBY', 'male', 20, 43, 198);
 INSERT INTO public.people VALUES (53, 'Kit Fisto', '87', 'none', 'green', 'black', NULL, 'male', 21, 44, 196);
 INSERT INTO public.people VALUES (54, 'Eeth Koth', NULL, 'black', 'brown', 'brown', NULL, 'male', 22, 45, 171);
 INSERT INTO public.people VALUES (55, 'Adi Gallia', '50', 'none', 'dark', 'blue', NULL, 'female', 23, 9, 184);
 INSERT INTO public.people VALUES (56, 'Saesee Tiin', NULL, 'none', 'pale', 'orange', NULL, 'male', 24, 47, 188);
 INSERT INTO public.people VALUES (57, 'Yarael Poof', NULL, 'none', 'white', 'yellow', NULL, 'male', 25, 48, 264);
 INSERT INTO public.people VALUES (58, 'Plo Koon', '80', 'none', 'orange', 'black', '22BBY', 'male', 26, 49, 188);
 INSERT INTO public.people VALUES (59, 'Mas Amedda', NULL, 'none', 'blue', 'blue', NULL, 'male', 27, 50, 196);
 INSERT INTO public.people VALUES (60, 'Gregar Typho', '85', 'black', 'dark', 'brown', NULL, 'male', 1, 8, 185);
 INSERT INTO public.people VALUES (61, 'Cordé', NULL, 'brown', 'light', 'brown', NULL, 'female', 1, 8, 157);
 INSERT INTO public.people VALUES (62, 'Cliegg Lars', NULL, 'brown', 'fair', 'blue', '82BBY', 'male', 1, 1, 183);
 INSERT INTO public.people VALUES (63, 'Poggle the Lesser', '80', 'none', 'green', 'yellow', NULL, 'male', 28, 11, 183);
 INSERT INTO public.people VALUES (64, 'Luminara Unduli', '56.2', 'black', 'yellow', 'blue', '58BBY', 'female', 29, 51, 170);
 INSERT INTO public.people VALUES (65, 'Barriss Offee', '50', 'black', 'yellow', 'blue', '40BBY', 'female', 29, 51, 166);
 INSERT INTO public.people VALUES (66, 'Dormé', NULL, 'brown', 'light', 'brown', NULL, 'female', 1, 8, 165);
 INSERT INTO public.people VALUES (67, 'Dooku', '80', 'white', 'fair', 'brown', '102BBY', 'male', 1, 52, 193);
 INSERT INTO public.people VALUES (68, 'Bail Prestor Organa', NULL, 'black', 'tan', 'brown', '67BBY', 'male', 1, 2, 191);
 INSERT INTO public.people VALUES (69, 'Jango Fett', '79', 'black', 'tan', 'brown', '66BBY', 'male', 1, 53, 183);
 INSERT INTO public.people VALUES (70, 'Zam Wesell', '55', 'blonde', 'fair, green, yellow', 'yellow', NULL, 'female', 30, 54, 168);
 INSERT INTO public.people VALUES (71, 'Dexter Jettster', '102', 'none', 'brown', 'yellow', NULL, 'male', 31, 55, 198);
 INSERT INTO public.people VALUES (72, 'Lama Su', '88', 'none', 'grey', 'black', NULL, 'male', 32, 10, 229);
 INSERT INTO public.people VALUES (73, 'Taun We', NULL, 'none', 'grey', 'black', NULL, 'female', 32, 10, 213);
 INSERT INTO public.people VALUES (74, 'Jocasta Nu', NULL, 'white', 'fair', 'blue', NULL, 'female', 1, 9, 167);
 INSERT INTO public.people VALUES (47, 'Ratts Tyerell', '15', 'none', 'grey, blue', NULL, NULL, 'male', 16, 38, 79);
 INSERT INTO public.people VALUES (75, 'R4-P17', NULL, 'none', 'silver, red', 'red, blue', NULL, 'female', NULL, 28, 96);
 INSERT INTO public.people VALUES (76, 'Wat Tambor', '48', 'none', 'green, grey', NULL, NULL, 'male', 33, 56, 193);
 INSERT INTO public.people VALUES (77, 'San Hill', NULL, 'none', 'grey', 'gold', NULL, 'male', 34, 57, 191);
 INSERT INTO public.people VALUES (78, 'Shaak Ti', '57', 'none', 'red, blue, white', 'black', NULL, 'female', 35, 58, 178);
 INSERT INTO public.people VALUES (79, 'Grievous', '159', 'none', 'brown, white', 'green, yellow', NULL, 'male', 36, 59, 216);
 INSERT INTO public.people VALUES (80, 'Tarfful', '136', 'brown', 'brown', 'blue', NULL, 'male', 3, 14, 234);
 INSERT INTO public.people VALUES (81, 'Raymus Antilles', '79', 'brown', 'light', 'brown', NULL, 'male', 1, 2, 188);
 INSERT INTO public.people VALUES (82, 'Sly Moore', '48', 'none', 'pale', 'white', NULL, 'female', NULL, 60, 178);
 INSERT INTO public.people VALUES (83, 'Tion Medon', '80', 'none', 'grey', 'black', NULL, 'male', 37, 12, 206);
 INSERT INTO public.people VALUES (84, 'Finn', NULL, 'black', 'dark', 'dark', NULL, 'male', 1, 28, NULL);
 INSERT INTO public.people VALUES (85, 'Rey', NULL, 'brown', 'light', 'hazel', NULL, 'female', 1, 28, NULL);
 INSERT INTO public.people VALUES (86, 'Poe Dameron', NULL, 'brown', 'light', 'brown', NULL, 'male', 1, 28, NULL);
 INSERT INTO public.people VALUES (87, 'BB8', NULL, 'none', 'none', 'black', NULL, 'none', 2, 28, NULL);
 INSERT INTO public.people VALUES (88, 'Captain Phasma', NULL, NULL, NULL, NULL, NULL, 'female', 1, 28, NULL);
 INSERT INTO public.people VALUES (35, 'Padmé Amidala', '45', 'brown', 'light', 'brown', '46BBY', 'female', 1, 8, 165);

--
-- TOC entry 4128 (class 0 OID 4163897)
-- Dependencies: 233
-- Data for Name: vessels; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.vessels VALUES (4, 'Sand Crawler', 'Corellia Mining Corporation', 'Digger Crawler', 'vehicle', 'wheeled', 150000, '36.8', '30', 46, 30, '50000', '2 months');
 INSERT INTO public.vessels VALUES (6, 'T-16 skyhopper', 'Incom Corporation', 'T-16 skyhopper', 'vehicle', 'repulsorcraft', 14500, '10.4', '1200', 1, 1, '50', '0');
 INSERT INTO public.vessels VALUES (7, 'X-34 landspeeder', 'SoroSuub Corporation', 'X-34 landspeeder', 'vehicle', 'repulsorcraft', 10550, '3.4', '250', 1, 1, '5', NULL);
 INSERT INTO public.vessels VALUES (8, 'TIE/LN starfighter', 'Sienar Fleet Systems', 'Twin Ion Engine/Ln Starfighter', 'vehicle', 'starfighter', NULL, '6.4', '1200', 1, 0, '65', '2 days');
 INSERT INTO public.vessels VALUES (14, 'Snowspeeder', 'Incom corporation', 't-47 airspeeder', 'vehicle', 'airspeeder', NULL, '4.5', '650', 2, 0, '10', 'none');
 INSERT INTO public.vessels VALUES (16, 'TIE bomber', 'Sienar Fleet Systems', 'TIE/sa bomber', 'vehicle', 'space/planetary bomber', NULL, '7.8', '850', 1, 0, 'none', '2 days');
 INSERT INTO public.vessels VALUES (18, 'AT-AT', 'Kuat Drive Yards, Imperial Department of Military Research', 'All Terrain Armored Transport', 'vehicle', 'assault walker', NULL, '20', '60', 5, 40, '1000', NULL);
 INSERT INTO public.vessels VALUES (19, 'AT-ST', 'Kuat Drive Yards, Imperial Department of Military Research', 'All Terrain Scout Transport', 'vehicle', 'walker', NULL, '2', '90', 2, 0, '200', 'none');
 INSERT INTO public.vessels VALUES (20, 'Storm IV Twin-Pod cloud car', 'Bespin Motors', 'Storm IV Twin-Pod', 'vehicle', 'repulsorcraft', 75000, '7', '1500', 2, 0, '10', '1 day');
 INSERT INTO public.vessels VALUES (24, 'Sail barge', 'Ubrikkian Industries Custom Vehicle Division', 'Modified Luxury Sail Barge', 'vehicle', 'sail barge', 285000, '30', '100', 26, 500, '2000000', 'Live food tanks');
 INSERT INTO public.vessels VALUES (25, 'Bantha-II cargo skiff', 'Ubrikkian Industries', 'Bantha-II', 'vehicle', 'repulsorcraft cargo skiff', 8000, '9.5', '250', 5, 16, '135000', '1 day');
 INSERT INTO public.vessels VALUES (26, 'TIE/IN interceptor', 'Sienar Fleet Systems', 'Twin Ion Engine Interceptor', 'vehicle', 'starfighter', NULL, '9.6', '1250', 1, 0, '75', '2 days');
 INSERT INTO public.vessels VALUES (30, 'Imperial Speeder Bike', 'Aratech Repulsor Company', '74-Z speeder bike', 'vehicle', 'speeder', 8000, '3', '360', 1, 1, '4', '1 day');
 INSERT INTO public.vessels VALUES (33, 'Vulture Droid', 'Haor Chall Engineering, Baktoid Armor Workshop', 'Vulture-class droid starfighter', 'vehicle', 'starfighter', NULL, '3.5', '1200', 0, 0, '0', 'none');
 INSERT INTO public.vessels VALUES (34, 'Multi-Troop Transport', 'Baktoid Armor Workshop', 'Multi-Troop Transport', 'vehicle', 'repulsorcraft', 138000, '31', '35', 4, 112, '12000', NULL);
 INSERT INTO public.vessels VALUES (35, 'Armored Assault Tank', 'Baktoid Armor Workshop', 'Armoured Assault Tank', 'vehicle', 'repulsorcraft', NULL, '9.75', '55', 4, 6, NULL, NULL);
 INSERT INTO public.vessels VALUES (36, 'Single Trooper Aerial Platform', 'Baktoid Armor Workshop', 'Single Trooper Aerial Platform', 'vehicle', 'repulsorcraft', 2500, '2', '400', 1, 0, 'none', 'none');
 INSERT INTO public.vessels VALUES (37, 'C-9979 landing craft', 'Haor Chall Engineering', 'C-9979 landing craft', 'vehicle', 'landing craft', 200000, '210', '587', 140, 284, '1800000', '1 day');
 INSERT INTO public.vessels VALUES (38, 'Tribubble bongo', 'Otoh Gunga Bongameken Cooperative', 'Tribubble bongo', 'vehicle', 'submarine', NULL, '15', '85', 1, 2, '1600', NULL);
 INSERT INTO public.vessels VALUES (42, 'Sith speeder', 'Razalon', 'FC-20 speeder bike', 'vehicle', 'speeder', 4000, '1.5', '180', 1, 0, '2', NULL);
 INSERT INTO public.vessels VALUES (44, 'Zephyr-G swoop bike', 'Mobquet Swoops and Speeders', 'Zephyr-G swoop bike', 'vehicle', 'repulsorcraft', 5750, '3.68', '350', 1, 1, '200', 'none');
 INSERT INTO public.vessels VALUES (45, 'Koro-2 Exodrive airspeeder', 'Desler Gizh Outworld Mobility Corporation', 'Koro-2 Exodrive airspeeder', 'vehicle', 'airspeeder', NULL, '6.6', '800', 1, 1, '80', NULL);
 INSERT INTO public.vessels VALUES (46, 'XJ-6 airspeeder', 'Narglatch AirTech prefabricated kit', 'XJ-6 airspeeder', 'vehicle', 'airspeeder', NULL, '6.23', '720', 1, 1, NULL, NULL);
 INSERT INTO public.vessels VALUES (50, 'LAAT/i', 'Rothana Heavy Engineering', 'Low Altitude Assault Transport/infrantry', 'vehicle', 'gunship', NULL, '17.4', '620', 6, 30, '170', NULL);
 INSERT INTO public.vessels VALUES (51, 'LAAT/c', 'Rothana Heavy Engineering', 'Low Altitude Assault Transport/carrier', 'vehicle', 'gunship', NULL, '28.82', '620', 1, 0, '40000', NULL);
 INSERT INTO public.vessels VALUES (60, 'Tsmeu-6 personal wheel bike', 'Z-Gomot Ternbuell Guppat Corporation', 'Tsmeu-6 personal wheel bike', 'vehicle', 'wheeled walker', 15000, '3.5', '330', 1, 1, '10', 'none');
 INSERT INTO public.vessels VALUES (62, 'Emergency Firespeeder', NULL, 'Fire suppression speeder', 'vehicle', 'fire suppression ship', NULL, NULL, NULL, 2, NULL, NULL, NULL);
 INSERT INTO public.vessels VALUES (67, 'Droid tri-fighter', 'Colla Designs, Phlac-Arphocc Automata Industries', 'tri-fighter', 'vehicle', 'droid starfighter', 20000, '5.4', '1180', 1, 0, '0', 'none');
 INSERT INTO public.vessels VALUES (69, 'Oevvaor jet catamaran', 'Appazanna Engineering Works', 'Oevvaor jet catamaran', 'vehicle', 'airspeeder', 12125, '15.1', '420', 2, 2, '50', '3 days');
 INSERT INTO public.vessels VALUES (70, 'Raddaugh Gnasp fluttercraft', 'Appazanna Engineering Works', 'Raddaugh Gnasp fluttercraft', 'vehicle', 'air speeder', 14750, '7', '310', 2, 0, '20', 'none');
 INSERT INTO public.vessels VALUES (71, 'Clone turbo tank', 'Kuat Drive Yards', 'HAVw A6 Juggernaut', 'vehicle', 'wheeled walker', 350000, '49.4', '160', 20, 300, '30000', '20 days');
 INSERT INTO public.vessels VALUES (72, 'Corporate Alliance tank droid', 'Techno Union', 'NR-N99 Persuader-class droid enforcer', 'vehicle', 'droid tank', 49000, '10.96', '100', 0, 4, 'none', 'none');
 INSERT INTO public.vessels VALUES (73, 'Droid gunship', 'Baktoid Fleet Ordnance, Haor Chall Engineering', 'HMP droid gunship', 'vehicle', 'airspeeder', 60000, '12.3', '820', 0, 0, '0', 'none');
 INSERT INTO public.vessels VALUES (76, 'AT-RT', 'Kuat Drive Yards', 'All Terrain Recon Transport', 'vehicle', 'walker', 40000, '3.2', '90', 1, 0, '20', '1 day');
 INSERT INTO public.vessels VALUES (53, 'AT-TE', 'Rothana Heavy Engineering, Kuat Drive Yards', 'All Terrain Tactical Enforcer', 'vehicle', 'walker', NULL, '13.2', '60', 6, 36, '10000', '21 days');
 INSERT INTO public.vessels VALUES (54, 'SPHA', 'Rothana Heavy Engineering', 'Self-Propelled Heavy Artillery', 'vehicle', 'walker', NULL, '140', '35', 25, 30, '500', '7 days');
 INSERT INTO public.vessels VALUES (55, 'Flitknot speeder', 'Huppla Pasa Tisc Shipwrights Collective', 'Flitknot speeder', 'vehicle', 'speeder', 8000, '2', '634', 1, 0, NULL, NULL);
 INSERT INTO public.vessels VALUES (56, 'Neimoidian shuttle', 'Haor Chall Engineering', 'Sheathipede-class transport shuttle', 'vehicle', 'transport', NULL, '20', '880', 2, 6, '1000', '7 days');
 INSERT INTO public.vessels VALUES (57, 'Geonosian starfighter', 'Huppla Pasa Tisc Shipwrights Collective', 'Nantex-class territorial defense', 'vehicle', 'starfighter', NULL, '9.8', '20000', 1, 0, NULL, NULL);
 INSERT INTO public.vessels VALUES (15, 'Executor', 'Kuat Drive Yards, Fondor Shipyards', 'Executor-class star dreadnought', 'starship', 'Star dreadnought', 1143350000, '19000', 'n/a', 279144, 38000, '250000000', '6 years');
 INSERT INTO public.vessels VALUES (5, 'Sentinel-class landing craft', 'Sienar Fleet Systems, Cyngus Spaceworks', 'Sentinel-class landing craft', 'starship', 'landing craft', 240000, '38', '1000', 5, 75, '180000', '1 month');
 INSERT INTO public.vessels VALUES (9, 'Death Star', 'Imperial Department of Military Research, Sienar Fleet Systems', 'DS-1 Orbital Battle Station', 'starship', 'Deep Space Mobile Battlestation', 1000000000000, '120000', 'n/a', 342953, 843342, '1000000000000', '3 years');
 INSERT INTO public.vessels VALUES (10, 'Millennium Falcon', 'Corellian Engineering Corporation', 'YT-1300 light freighter', 'starship', 'Light freighter', 100000, '34.37', '1050', 4, 6, '100000', '2 months');
 INSERT INTO public.vessels VALUES (11, 'Y-wing', 'Koensayr Manufacturing', 'BTL Y-wing', 'starship', 'assault starfighter', 134999, '14', '1000km', 2, 0, '110', '1 week');
 INSERT INTO public.vessels VALUES (12, 'X-wing', 'Incom Corporation', 'T-65 X-wing', 'starship', 'Starfighter', 149999, '12.5', '1050', 1, 0, '110', '1 week');
 INSERT INTO public.vessels VALUES (13, 'TIE Advanced x1', 'Sienar Fleet Systems', 'Twin Ion Engine Advanced x1', 'starship', 'Starfighter', NULL, '9.2', '1200', 1, 0, '150', '5 days');
 INSERT INTO public.vessels VALUES (21, 'Slave 1', 'Kuat Systems Engineering', 'Firespray-31-class patrol and attack', 'starship', 'Patrol craft', NULL, '21.5', '1000', 1, 6, '70000', '1 month');
 INSERT INTO public.vessels VALUES (22, 'Imperial shuttle', 'Sienar Fleet Systems', 'Lambda-class T-4a shuttle', 'starship', 'Armed government transport', 240000, '20', '850', 6, 20, '80000', '2 months');
 INSERT INTO public.vessels VALUES (23, 'EF76 Nebulon-B escort frigate', 'Kuat Drive Yards', 'EF76 Nebulon-B escort frigate', 'starship', 'Escort ship', 8500000, '300', '800', 854, 75, '6000000', '2 years');
 INSERT INTO public.vessels VALUES (27, 'Calamari Cruiser', 'Mon Calamari shipyards', 'MC80 Liberty type Star Cruiser', 'starship', 'Star Cruiser', 104000000, '1200', 'n/a', 5400, 1200, NULL, '2 years');
 INSERT INTO public.vessels VALUES (28, 'A-wing', 'Alliance Underground Engineering, Incom Corporation', 'RZ-1 A-wing Interceptor', 'starship', 'Starfighter', 175000, '9.6', '1300', 1, 0, '40', '1 week');
 INSERT INTO public.vessels VALUES (29, 'B-wing', 'Slayn & Korpil', 'A/SF-01 B-wing starfighter', 'starship', 'Assault Starfighter', 220000, '16.9', '950', 1, 0, '45', '1 week');
 INSERT INTO public.vessels VALUES (31, 'Republic Cruiser', 'Corellian Engineering Corporation', 'Consular-class cruiser', 'starship', 'Space cruiser', NULL, '115', '900', 9, 16, NULL, NULL);
 INSERT INTO public.vessels VALUES (39, 'Naboo fighter', 'Theed Palace Space Vessel Engineering Corps', 'N-1 starfighter', 'starship', 'Starfighter', 200000, '11', '1100', 1, 0, '65', '7 days');
 INSERT INTO public.vessels VALUES (40, 'Naboo Royal Starship', 'Theed Palace Space Vessel Engineering Corps, Nubia Star Drives', 'J-type 327 Nubian royal starship', 'starship', 'yacht', NULL, '76', '920', 8, NULL, NULL, NULL);
 INSERT INTO public.vessels VALUES (41, 'Scimitar', 'Republic Sienar Systems', 'Star Courier', 'starship', 'Space Transport', 55000000, '26.5', '1180', 1, 6, '2500000', '30 days');
 INSERT INTO public.vessels VALUES (43, 'J-type diplomatic barge', 'Theed Palace Space Vessel Engineering Corps, Nubia Star Drives', 'J-type diplomatic barge', 'starship', 'Diplomatic barge', 2000000, '39', '2000', 5, 10, NULL, '1 year');
 INSERT INTO public.vessels VALUES (47, 'AA-9 Coruscant freighter', 'Botajef Shipyards', 'Botajef AA-9 Freighter-Liner', 'starship', 'freighter', NULL, '390', NULL, NULL, 30000, NULL, NULL);
 INSERT INTO public.vessels VALUES (48, 'Jedi starfighter', 'Kuat Systems Engineering', 'Delta-7 Aethersprite-class interceptor', 'starship', 'Starfighter', 180000, '8', '1150', 1, 0, '60', '7 days');
 INSERT INTO public.vessels VALUES (49, 'H-type Nubian yacht', 'Theed Palace Space Vessel Engineering Corps', 'H-type Nubian yacht', 'starship', 'yacht', NULL, '47.9', '8000', 4, NULL, NULL, NULL);
 INSERT INTO public.vessels VALUES (3, 'Star Destroyer', 'Kuat Drive Yards', 'Imperial I-class Star Destroyer', 'starship', 'Star Destroyer', 150000000, '1,600', '975', 47060, 0, '36000000', '2 years');
 INSERT INTO public.vessels VALUES (59, 'Trade Federation cruiser', 'Rendili StarDrive, Free Dac Volunteers Engineering corps.', 'Providence-class carrier/destroyer', 'starship', 'capital ship', 125000000, '1088', '1050', 600, 48247, '50000000', '4 years');
 INSERT INTO public.vessels VALUES (61, 'Theta-class T-2c shuttle', 'Cygnus Spaceworks', 'Theta-class T-2c shuttle', 'starship', 'transport', 1000000, '18.5', '2000', 5, 16, '50000', '56 days');
 INSERT INTO public.vessels VALUES (77, 'T-70 X-wing fighter', 'Incom', 'T-70 X-wing fighter', 'starship', 'fighter', NULL, NULL, NULL, 1, NULL, NULL, NULL);
 INSERT INTO public.vessels VALUES (17, 'Rebel transport', 'Gallofree Yards, Inc.', 'GR-75 medium transport', 'starship', 'Medium transport', NULL, '90', '650', 6, 90, '19000000', '6 months');
 INSERT INTO public.vessels VALUES (32, 'Droid control ship', 'Hoersch-Kessel Drive, Inc.', 'Lucrehulk-class Droid Control Ship', 'starship', 'Droid control ship', NULL, '3170', 'n/a', 175, 139000, '4000000000', '500 days');
 INSERT INTO public.vessels VALUES (52, 'Republic Assault ship', 'Rothana Heavy Engineering', 'Acclamator I-class assault ship', 'starship', 'assault ship', NULL, '752', NULL, 700, 16000, '11250000', '2 years');
 INSERT INTO public.vessels VALUES (58, 'Solar Sailer', 'Huppla Pasa Tisc Shipwrights Collective', 'Punworcca 116-class interstellar sloop', 'starship', 'yacht', 35700, '15.2', '1600', 3, 11, '240', '7 days');
 INSERT INTO public.vessels VALUES (63, 'Republic attack cruiser', 'Kuat Drive Yards, Allanteen Six shipyards', 'Senator-class Star Destroyer', 'starship', 'star destroyer', 59000000, '1137', '975', 7400, 2000, '20000000', '2 years');
 INSERT INTO public.vessels VALUES (64, 'Naboo star skiff', 'Theed Palace Space Vessel Engineering Corps/Nubia Star Drives, Incorporated', 'J-type star skiff', 'starship', 'yacht', NULL, '29.2', '1050', 3, 3, NULL, NULL);
 INSERT INTO public.vessels VALUES (65, 'Jedi Interceptor', 'Kuat Systems Engineering', 'Eta-2 Actis-class light interceptor', 'starship', 'starfighter', 320000, '5.47', '1500', 1, 0, '60', '2 days');
 INSERT INTO public.vessels VALUES (66, 'arc-170', 'Incom Corporation, Subpro Corporation', 'Aggressive Reconnaissance-170 starfighte', 'starship', 'starfighter', 155000, '14.5', '1000', 3, 0, '110', '5 days');
 INSERT INTO public.vessels VALUES (74, 'Belbullab-22 starfighter', 'Feethan Ottraw Scalable Assemblies', 'Belbullab-22 starfighter', 'starship', 'starfighter', 168000, '6.71', '1100', 1, 0, '140', '7 days');
 INSERT INTO public.vessels VALUES (75, 'V-wing', 'Kuat Systems Engineering', 'Alpha-3 Nimbus-class V-wing starfighter', 'starship', 'starfighter', 102500, '7.9', '1050', 1, 0, '60', '15 hours');
 INSERT INTO public.vessels VALUES (2, 'CR90 corvette', 'Corellian Engineering Corporation', 'CR90 corvette', 'starship', 'corvette', 3500000, '150', '950', 165, 600, '3000000', '1 year');
 INSERT INTO public.vessels VALUES (68, 'Banking clan frigate', 'Hoersch-Kessel Drive, Inc, Gwori Revolutionary Industries', 'Munificent-class star frigate', 'starship', 'cruiser', 57000000, '825', NULL, 200, NULL, '40000000', '2 years');



--
-- TOC entry 4138 (class 0 OID 4163940)
-- Dependencies: 243
-- Data for Name: starship_specs; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.starship_specs VALUES (1, '2.0', '40', 15);
 INSERT INTO public.starship_specs VALUES (2, '1.0', '70', 5);
 INSERT INTO public.starship_specs VALUES (3, '4.0', '10', 9);
 INSERT INTO public.starship_specs VALUES (4, '0.5', '75', 10);
 INSERT INTO public.starship_specs VALUES (5, '1.0', '80', 11);
 INSERT INTO public.starship_specs VALUES (6, '1.0', '100', 12);
 INSERT INTO public.starship_specs VALUES (7, '1.0', '105', 13);
 INSERT INTO public.starship_specs VALUES (8, '3.0', '70', 21);
 INSERT INTO public.starship_specs VALUES (9, '1.0', '50', 22);
 INSERT INTO public.starship_specs VALUES (10, '2.0', '40', 23);
 INSERT INTO public.starship_specs VALUES (11, '1.0', '60', 27);
 INSERT INTO public.starship_specs VALUES (12, '1.0', '120', 28);
 INSERT INTO public.starship_specs VALUES (13, '2.0', '91', 29);
 INSERT INTO public.starship_specs VALUES (14, '2.0', NULL, 31);
 INSERT INTO public.starship_specs VALUES (15, '1.0', NULL, 39);
 INSERT INTO public.starship_specs VALUES (16, '1.8', NULL, 40);
 INSERT INTO public.starship_specs VALUES (17, '1.5', NULL, 41);
 INSERT INTO public.starship_specs VALUES (18, '0.7', NULL, 43);
 INSERT INTO public.starship_specs VALUES (19, NULL, NULL, 47);
 INSERT INTO public.starship_specs VALUES (20, '1.0', NULL, 48);
 INSERT INTO public.starship_specs VALUES (21, '0.9', NULL, 49);
 INSERT INTO public.starship_specs VALUES (22, '2.0', '60', 3);
 INSERT INTO public.starship_specs VALUES (23, '1.5', NULL, 59);
 INSERT INTO public.starship_specs VALUES (24, '1.0', NULL, 61);
 INSERT INTO public.starship_specs VALUES (25, NULL, NULL, 77);
 INSERT INTO public.starship_specs VALUES (26, '4.0', '20', 17);
 INSERT INTO public.starship_specs VALUES (27, '2.0', NULL, 32);
 INSERT INTO public.starship_specs VALUES (28, '0.6', NULL, 52);
 INSERT INTO public.starship_specs VALUES (29, '1.5', NULL, 58);
 INSERT INTO public.starship_specs VALUES (30, '1.0', NULL, 63);
 INSERT INTO public.starship_specs VALUES (31, '0.5', NULL, 64);
 INSERT INTO public.starship_specs VALUES (32, '1.0', NULL, 65);
 INSERT INTO public.starship_specs VALUES (33, '1.0', '100', 66);
 INSERT INTO public.starship_specs VALUES (34, '6', NULL, 74);
 INSERT INTO public.starship_specs VALUES (35, '1.0', NULL, 75);
 INSERT INTO public.starship_specs VALUES (36, '2.0', '60', 2);
 INSERT INTO public.starship_specs VALUES (37, '1.0', NULL, 68);


--
-- TOC entry 4122 (class 0 OID 4163867)
-- Dependencies: 227
-- Data for Name: people_in_films; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.people_in_films VALUES (1, 1, 1);
 INSERT INTO public.people_in_films VALUES (2, 2, 1);
 INSERT INTO public.people_in_films VALUES (3, 3, 1);
 INSERT INTO public.people_in_films VALUES (4, 4, 1);
 INSERT INTO public.people_in_films VALUES (5, 5, 1);
 INSERT INTO public.people_in_films VALUES (6, 6, 1);
 INSERT INTO public.people_in_films VALUES (7, 7, 1);
 INSERT INTO public.people_in_films VALUES (8, 8, 1);
 INSERT INTO public.people_in_films VALUES (9, 9, 1);
 INSERT INTO public.people_in_films VALUES (10, 10, 1);
 INSERT INTO public.people_in_films VALUES (11, 12, 1);
 INSERT INTO public.people_in_films VALUES (12, 13, 1);
 INSERT INTO public.people_in_films VALUES (13, 14, 1);
 INSERT INTO public.people_in_films VALUES (14, 15, 1);
 INSERT INTO public.people_in_films VALUES (15, 16, 1);
 INSERT INTO public.people_in_films VALUES (16, 18, 1);
 INSERT INTO public.people_in_films VALUES (17, 19, 1);
 INSERT INTO public.people_in_films VALUES (18, 81, 1);
 INSERT INTO public.people_in_films VALUES (19, 2, 5);
 INSERT INTO public.people_in_films VALUES (20, 3, 5);
 INSERT INTO public.people_in_films VALUES (21, 6, 5);
 INSERT INTO public.people_in_films VALUES (22, 7, 5);
 INSERT INTO public.people_in_films VALUES (23, 10, 5);
 INSERT INTO public.people_in_films VALUES (24, 11, 5);
 INSERT INTO public.people_in_films VALUES (25, 20, 5);
 INSERT INTO public.people_in_films VALUES (26, 21, 5);
 INSERT INTO public.people_in_films VALUES (27, 22, 5);
 INSERT INTO public.people_in_films VALUES (28, 33, 5);
 INSERT INTO public.people_in_films VALUES (29, 36, 5);
 INSERT INTO public.people_in_films VALUES (30, 40, 5);
 INSERT INTO public.people_in_films VALUES (31, 43, 5);
 INSERT INTO public.people_in_films VALUES (32, 46, 5);
 INSERT INTO public.people_in_films VALUES (33, 51, 5);
 INSERT INTO public.people_in_films VALUES (34, 52, 5);
 INSERT INTO public.people_in_films VALUES (35, 53, 5);
 INSERT INTO public.people_in_films VALUES (36, 58, 5);
 INSERT INTO public.people_in_films VALUES (37, 59, 5);
 INSERT INTO public.people_in_films VALUES (38, 60, 5);
 INSERT INTO public.people_in_films VALUES (39, 61, 5);
 INSERT INTO public.people_in_films VALUES (40, 62, 5);
 INSERT INTO public.people_in_films VALUES (41, 63, 5);
 INSERT INTO public.people_in_films VALUES (42, 64, 5);
 INSERT INTO public.people_in_films VALUES (43, 65, 5);
 INSERT INTO public.people_in_films VALUES (44, 66, 5);
 INSERT INTO public.people_in_films VALUES (45, 67, 5);
 INSERT INTO public.people_in_films VALUES (46, 68, 5);
 INSERT INTO public.people_in_films VALUES (47, 69, 5);
 INSERT INTO public.people_in_films VALUES (48, 70, 5);
 INSERT INTO public.people_in_films VALUES (49, 71, 5);
 INSERT INTO public.people_in_films VALUES (50, 72, 5);
 INSERT INTO public.people_in_films VALUES (51, 73, 5);
 INSERT INTO public.people_in_films VALUES (52, 74, 5);
 INSERT INTO public.people_in_films VALUES (53, 75, 5);
 INSERT INTO public.people_in_films VALUES (54, 76, 5);
 INSERT INTO public.people_in_films VALUES (55, 77, 5);
 INSERT INTO public.people_in_films VALUES (56, 78, 5);
 INSERT INTO public.people_in_films VALUES (57, 82, 5);
 INSERT INTO public.people_in_films VALUES (58, 35, 5);
 INSERT INTO public.people_in_films VALUES (59, 2, 4);
 INSERT INTO public.people_in_films VALUES (60, 3, 4);
 INSERT INTO public.people_in_films VALUES (61, 10, 4);
 INSERT INTO public.people_in_films VALUES (62, 11, 4);
 INSERT INTO public.people_in_films VALUES (63, 16, 4);
 INSERT INTO public.people_in_films VALUES (64, 20, 4);
 INSERT INTO public.people_in_films VALUES (65, 21, 4);
 INSERT INTO public.people_in_films VALUES (66, 32, 4);
 INSERT INTO public.people_in_films VALUES (67, 33, 4);
 INSERT INTO public.people_in_films VALUES (68, 34, 4);
 INSERT INTO public.people_in_films VALUES (69, 36, 4);
 INSERT INTO public.people_in_films VALUES (70, 37, 4);
 INSERT INTO public.people_in_films VALUES (71, 38, 4);
 INSERT INTO public.people_in_films VALUES (72, 39, 4);
 INSERT INTO public.people_in_films VALUES (73, 40, 4);
 INSERT INTO public.people_in_films VALUES (74, 41, 4);
 INSERT INTO public.people_in_films VALUES (75, 42, 4);
 INSERT INTO public.people_in_films VALUES (76, 43, 4);
 INSERT INTO public.people_in_films VALUES (77, 44, 4);
 INSERT INTO public.people_in_films VALUES (78, 46, 4);
 INSERT INTO public.people_in_films VALUES (79, 48, 4);
 INSERT INTO public.people_in_films VALUES (80, 49, 4);
 INSERT INTO public.people_in_films VALUES (81, 50, 4);
 INSERT INTO public.people_in_films VALUES (82, 51, 4);
 INSERT INTO public.people_in_films VALUES (83, 52, 4);
 INSERT INTO public.people_in_films VALUES (84, 53, 4);
 INSERT INTO public.people_in_films VALUES (85, 54, 4);
 INSERT INTO public.people_in_films VALUES (86, 55, 4);
 INSERT INTO public.people_in_films VALUES (87, 56, 4);
 INSERT INTO public.people_in_films VALUES (88, 57, 4);
 INSERT INTO public.people_in_films VALUES (89, 58, 4);
 INSERT INTO public.people_in_films VALUES (90, 59, 4);
 INSERT INTO public.people_in_films VALUES (91, 47, 4);
 INSERT INTO public.people_in_films VALUES (92, 35, 4);
 INSERT INTO public.people_in_films VALUES (93, 1, 6);
 INSERT INTO public.people_in_films VALUES (94, 2, 6);
 INSERT INTO public.people_in_films VALUES (95, 3, 6);
 INSERT INTO public.people_in_films VALUES (96, 4, 6);
 INSERT INTO public.people_in_films VALUES (97, 5, 6);
 INSERT INTO public.people_in_films VALUES (98, 6, 6);
 INSERT INTO public.people_in_films VALUES (99, 7, 6);
 INSERT INTO public.people_in_films VALUES (100, 10, 6);
 INSERT INTO public.people_in_films VALUES (101, 11, 6);
 INSERT INTO public.people_in_films VALUES (102, 12, 6);
 INSERT INTO public.people_in_films VALUES (103, 13, 6);
 INSERT INTO public.people_in_films VALUES (104, 20, 6);
 INSERT INTO public.people_in_films VALUES (105, 21, 6);
 INSERT INTO public.people_in_films VALUES (106, 33, 6);
 INSERT INTO public.people_in_films VALUES (107, 46, 6);
 INSERT INTO public.people_in_films VALUES (108, 51, 6);
 INSERT INTO public.people_in_films VALUES (109, 52, 6);
 INSERT INTO public.people_in_films VALUES (110, 53, 6);
 INSERT INTO public.people_in_films VALUES (111, 54, 6);
 INSERT INTO public.people_in_films VALUES (112, 55, 6);
 INSERT INTO public.people_in_films VALUES (113, 56, 6);
 INSERT INTO public.people_in_films VALUES (114, 58, 6);
 INSERT INTO public.people_in_films VALUES (115, 63, 6);
 INSERT INTO public.people_in_films VALUES (116, 64, 6);
 INSERT INTO public.people_in_films VALUES (117, 67, 6);
 INSERT INTO public.people_in_films VALUES (118, 68, 6);
 INSERT INTO public.people_in_films VALUES (119, 75, 6);
 INSERT INTO public.people_in_films VALUES (120, 78, 6);
 INSERT INTO public.people_in_films VALUES (121, 79, 6);
 INSERT INTO public.people_in_films VALUES (122, 80, 6);
 INSERT INTO public.people_in_films VALUES (123, 81, 6);
 INSERT INTO public.people_in_films VALUES (124, 82, 6);
 INSERT INTO public.people_in_films VALUES (125, 83, 6);
 INSERT INTO public.people_in_films VALUES (126, 35, 6);
 INSERT INTO public.people_in_films VALUES (127, 1, 3);
 INSERT INTO public.people_in_films VALUES (128, 2, 3);
 INSERT INTO public.people_in_films VALUES (129, 3, 3);
 INSERT INTO public.people_in_films VALUES (130, 4, 3);
 INSERT INTO public.people_in_films VALUES (131, 5, 3);
 INSERT INTO public.people_in_films VALUES (132, 10, 3);
 INSERT INTO public.people_in_films VALUES (133, 13, 3);
 INSERT INTO public.people_in_films VALUES (134, 14, 3);
 INSERT INTO public.people_in_films VALUES (135, 16, 3);
 INSERT INTO public.people_in_films VALUES (136, 18, 3);
 INSERT INTO public.people_in_films VALUES (137, 20, 3);
 INSERT INTO public.people_in_films VALUES (138, 21, 3);
 INSERT INTO public.people_in_films VALUES (139, 22, 3);
 INSERT INTO public.people_in_films VALUES (140, 25, 3);
 INSERT INTO public.people_in_films VALUES (141, 27, 3);
 INSERT INTO public.people_in_films VALUES (142, 28, 3);
 INSERT INTO public.people_in_films VALUES (143, 29, 3);
 INSERT INTO public.people_in_films VALUES (144, 30, 3);
 INSERT INTO public.people_in_films VALUES (145, 31, 3);
 INSERT INTO public.people_in_films VALUES (146, 45, 3);
 INSERT INTO public.people_in_films VALUES (147, 1, 2);
 INSERT INTO public.people_in_films VALUES (148, 2, 2);
 INSERT INTO public.people_in_films VALUES (149, 3, 2);
 INSERT INTO public.people_in_films VALUES (150, 4, 2);
 INSERT INTO public.people_in_films VALUES (151, 5, 2);
 INSERT INTO public.people_in_films VALUES (152, 10, 2);
 INSERT INTO public.people_in_films VALUES (153, 13, 2);
 INSERT INTO public.people_in_films VALUES (154, 14, 2);
 INSERT INTO public.people_in_films VALUES (155, 18, 2);
 INSERT INTO public.people_in_films VALUES (156, 20, 2);
 INSERT INTO public.people_in_films VALUES (157, 21, 2);
 INSERT INTO public.people_in_films VALUES (158, 22, 2);
 INSERT INTO public.people_in_films VALUES (159, 23, 2);
 INSERT INTO public.people_in_films VALUES (160, 24, 2);
 INSERT INTO public.people_in_films VALUES (161, 25, 2);
 INSERT INTO public.people_in_films VALUES (162, 26, 2);
 INSERT INTO public.people_in_films VALUES (163, 1, 7);
 INSERT INTO public.people_in_films VALUES (164, 3, 7);
 INSERT INTO public.people_in_films VALUES (165, 5, 7);
 INSERT INTO public.people_in_films VALUES (166, 13, 7);
 INSERT INTO public.people_in_films VALUES (167, 14, 7);
 INSERT INTO public.people_in_films VALUES (168, 27, 7);
 INSERT INTO public.people_in_films VALUES (169, 84, 7);
 INSERT INTO public.people_in_films VALUES (170, 85, 7);
 INSERT INTO public.people_in_films VALUES (171, 86, 7);
 INSERT INTO public.people_in_films VALUES (172, 87, 7);
 INSERT INTO public.people_in_films VALUES (173, 88, 7);


--
-- TOC entry 4134 (class 0 OID 4163924)
-- Dependencies: 239
-- Data for Name: pilots; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.pilots VALUES (1, 1, 14);
 INSERT INTO public.pilots VALUES (2, 18, 14);
 INSERT INTO public.pilots VALUES (3, 13, 19);
 INSERT INTO public.pilots VALUES (4, 1, 30);
 INSERT INTO public.pilots VALUES (5, 5, 30);
 INSERT INTO public.pilots VALUES (6, 10, 38);
 INSERT INTO public.pilots VALUES (7, 32, 38);
 INSERT INTO public.pilots VALUES (8, 44, 42);
 INSERT INTO public.pilots VALUES (9, 11, 44);
 INSERT INTO public.pilots VALUES (10, 70, 45);
 INSERT INTO public.pilots VALUES (11, 11, 46);
 INSERT INTO public.pilots VALUES (12, 79, 60);
 INSERT INTO public.pilots VALUES (13, 67, 55);
 INSERT INTO public.pilots VALUES (14, 13, 10);
 INSERT INTO public.pilots VALUES (15, 14, 10);
 INSERT INTO public.pilots VALUES (16, 25, 10);
 INSERT INTO public.pilots VALUES (17, 31, 10);
 INSERT INTO public.pilots VALUES (18, 1, 12);
 INSERT INTO public.pilots VALUES (19, 9, 12);
 INSERT INTO public.pilots VALUES (20, 18, 12);
 INSERT INTO public.pilots VALUES (21, 19, 12);
 INSERT INTO public.pilots VALUES (22, 4, 13);
 INSERT INTO public.pilots VALUES (23, 22, 21);
 INSERT INTO public.pilots VALUES (24, 1, 22);
 INSERT INTO public.pilots VALUES (25, 13, 22);
 INSERT INTO public.pilots VALUES (26, 14, 22);
 INSERT INTO public.pilots VALUES (27, 29, 28);
 INSERT INTO public.pilots VALUES (28, 11, 39);
 INSERT INTO public.pilots VALUES (29, 60, 39);
 INSERT INTO public.pilots VALUES (30, 35, 39);
 INSERT INTO public.pilots VALUES (31, 39, 40);
 INSERT INTO public.pilots VALUES (32, 44, 41);
 INSERT INTO public.pilots VALUES (33, 10, 48);
 INSERT INTO public.pilots VALUES (34, 58, 48);
 INSERT INTO public.pilots VALUES (35, 35, 49);
 INSERT INTO public.pilots VALUES (36, 10, 59);
 INSERT INTO public.pilots VALUES (37, 11, 59);
 INSERT INTO public.pilots VALUES (38, 86, 77);
 INSERT INTO public.pilots VALUES (39, 10, 64);
 INSERT INTO public.pilots VALUES (40, 35, 64);
 INSERT INTO public.pilots VALUES (41, 10, 65);
 INSERT INTO public.pilots VALUES (42, 11, 65);
 INSERT INTO public.pilots VALUES (43, 10, 74);
 INSERT INTO public.pilots VALUES (44, 79, 74);




--
-- TOC entry 4132 (class 0 OID 4163916)
-- Dependencies: 237
-- Data for Name: planets_in_films; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.planets_in_films VALUES (1, 1, 2);
 INSERT INTO public.planets_in_films VALUES (2, 1, 3);
 INSERT INTO public.planets_in_films VALUES (3, 1, 1);
 INSERT INTO public.planets_in_films VALUES (4, 5, 8);
 INSERT INTO public.planets_in_films VALUES (5, 5, 9);
 INSERT INTO public.planets_in_films VALUES (6, 5, 10);
 INSERT INTO public.planets_in_films VALUES (7, 5, 11);
 INSERT INTO public.planets_in_films VALUES (8, 5, 1);
 INSERT INTO public.planets_in_films VALUES (9, 4, 8);
 INSERT INTO public.planets_in_films VALUES (10, 4, 9);
 INSERT INTO public.planets_in_films VALUES (11, 4, 1);
 INSERT INTO public.planets_in_films VALUES (12, 6, 2);
 INSERT INTO public.planets_in_films VALUES (13, 6, 5);
 INSERT INTO public.planets_in_films VALUES (14, 6, 8);
 INSERT INTO public.planets_in_films VALUES (15, 6, 9);
 INSERT INTO public.planets_in_films VALUES (16, 6, 12);
 INSERT INTO public.planets_in_films VALUES (17, 6, 13);
 INSERT INTO public.planets_in_films VALUES (18, 6, 14);
 INSERT INTO public.planets_in_films VALUES (19, 6, 15);
 INSERT INTO public.planets_in_films VALUES (20, 6, 16);
 INSERT INTO public.planets_in_films VALUES (21, 6, 17);
 INSERT INTO public.planets_in_films VALUES (22, 6, 18);
 INSERT INTO public.planets_in_films VALUES (23, 6, 19);
 INSERT INTO public.planets_in_films VALUES (24, 6, 1);
 INSERT INTO public.planets_in_films VALUES (25, 3, 5);
 INSERT INTO public.planets_in_films VALUES (26, 3, 7);
 INSERT INTO public.planets_in_films VALUES (27, 3, 8);
 INSERT INTO public.planets_in_films VALUES (28, 3, 9);
 INSERT INTO public.planets_in_films VALUES (29, 3, 1);
 INSERT INTO public.planets_in_films VALUES (30, 2, 4);
 INSERT INTO public.planets_in_films VALUES (31, 2, 5);
 INSERT INTO public.planets_in_films VALUES (32, 2, 6);
 INSERT INTO public.planets_in_films VALUES (33, 2, 27);
 INSERT INTO public.planets_in_films VALUES (34, 7, 61);




--
-- TOC entry 4130 (class 0 OID 4163908)
-- Dependencies: 235
-- Data for Name: species_in_films; Type: TABLE DATA; Schema:  Owner: -
--

 INSERT INTO public.species_in_films VALUES (1, 1, 5);
 INSERT INTO public.species_in_films VALUES (2, 1, 3);
 INSERT INTO public.species_in_films VALUES (3, 1, 2);
 INSERT INTO public.species_in_films VALUES (4, 1, 1);
 INSERT INTO public.species_in_films VALUES (5, 1, 4);
 INSERT INTO public.species_in_films VALUES (6, 5, 32);
 INSERT INTO public.species_in_films VALUES (7, 5, 33);
 INSERT INTO public.species_in_films VALUES (8, 5, 2);
 INSERT INTO public.species_in_films VALUES (9, 5, 35);
 INSERT INTO public.species_in_films VALUES (10, 5, 6);
 INSERT INTO public.species_in_films VALUES (11, 5, 1);
 INSERT INTO public.species_in_films VALUES (12, 5, 12);
 INSERT INTO public.species_in_films VALUES (13, 5, 34);
 INSERT INTO public.species_in_films VALUES (14, 5, 13);
 INSERT INTO public.species_in_films VALUES (15, 5, 15);
 INSERT INTO public.species_in_films VALUES (16, 5, 28);
 INSERT INTO public.species_in_films VALUES (17, 5, 29);
 INSERT INTO public.species_in_films VALUES (18, 5, 30);
 INSERT INTO public.species_in_films VALUES (19, 5, 31);
 INSERT INTO public.species_in_films VALUES (20, 4, 1);
 INSERT INTO public.species_in_films VALUES (21, 4, 2);
 INSERT INTO public.species_in_films VALUES (22, 4, 6);
 INSERT INTO public.species_in_films VALUES (23, 4, 11);
 INSERT INTO public.species_in_films VALUES (24, 4, 12);
 INSERT INTO public.species_in_films VALUES (25, 4, 13);
 INSERT INTO public.species_in_films VALUES (26, 4, 14);
 INSERT INTO public.species_in_films VALUES (27, 4, 15);
 INSERT INTO public.species_in_films VALUES (28, 4, 16);
 INSERT INTO public.species_in_films VALUES (29, 4, 17);
 INSERT INTO public.species_in_films VALUES (30, 4, 18);
 INSERT INTO public.species_in_films VALUES (31, 4, 19);
 INSERT INTO public.species_in_films VALUES (32, 4, 20);
 INSERT INTO public.species_in_films VALUES (33, 4, 21);
 INSERT INTO public.species_in_films VALUES (34, 4, 22);
 INSERT INTO public.species_in_films VALUES (35, 4, 23);
 INSERT INTO public.species_in_films VALUES (36, 4, 24);
 INSERT INTO public.species_in_films VALUES (37, 4, 25);
 INSERT INTO public.species_in_films VALUES (38, 4, 26);
 INSERT INTO public.species_in_films VALUES (39, 4, 27);
 INSERT INTO public.species_in_films VALUES (40, 6, 19);
 INSERT INTO public.species_in_films VALUES (41, 6, 33);
 INSERT INTO public.species_in_films VALUES (42, 6, 2);
 INSERT INTO public.species_in_films VALUES (43, 6, 3);
 INSERT INTO public.species_in_films VALUES (44, 6, 36);
 INSERT INTO public.species_in_films VALUES (45, 6, 37);
 INSERT INTO public.species_in_films VALUES (46, 6, 6);
 INSERT INTO public.species_in_films VALUES (47, 6, 1);
 INSERT INTO public.species_in_films VALUES (48, 6, 34);
 INSERT INTO public.species_in_films VALUES (49, 6, 15);
 INSERT INTO public.species_in_films VALUES (50, 6, 35);
 INSERT INTO public.species_in_films VALUES (51, 6, 20);
 INSERT INTO public.species_in_films VALUES (52, 6, 23);
 INSERT INTO public.species_in_films VALUES (53, 6, 24);
 INSERT INTO public.species_in_films VALUES (54, 6, 25);
 INSERT INTO public.species_in_films VALUES (55, 6, 26);
 INSERT INTO public.species_in_films VALUES (56, 6, 27);
 INSERT INTO public.species_in_films VALUES (57, 6, 28);
 INSERT INTO public.species_in_films VALUES (58, 6, 29);
 INSERT INTO public.species_in_films VALUES (59, 6, 30);
 INSERT INTO public.species_in_films VALUES (60, 3, 1);
 INSERT INTO public.species_in_films VALUES (61, 3, 2);
 INSERT INTO public.species_in_films VALUES (62, 3, 3);
 INSERT INTO public.species_in_films VALUES (63, 3, 5);
 INSERT INTO public.species_in_films VALUES (64, 3, 6);
 INSERT INTO public.species_in_films VALUES (65, 3, 8);
 INSERT INTO public.species_in_films VALUES (66, 3, 9);
 INSERT INTO public.species_in_films VALUES (67, 3, 10);
 INSERT INTO public.species_in_films VALUES (68, 3, 15);
 INSERT INTO public.species_in_films VALUES (69, 2, 6);
 INSERT INTO public.species_in_films VALUES (70, 2, 7);
 INSERT INTO public.species_in_films VALUES (71, 2, 3);
 INSERT INTO public.species_in_films VALUES (72, 2, 2);
 INSERT INTO public.species_in_films VALUES (73, 2, 1);
 INSERT INTO public.species_in_films VALUES (74, 7, 3);
 INSERT INTO public.species_in_films VALUES (75, 7, 2);
 INSERT INTO public.species_in_films VALUES (76, 7, 1);


select setval('public.people__id_seq', 89, false);
select setval('public.planets__id_seq', 62, false);
select setval('public.vessels__id_seq', 78, false);
select setval('public.species__id_seq', 38, false);
select setval('public.films__id_seq', 8, false);
select setval('public.people_in_films__id_seq', 174, false);
select setval('public.planets_in_films__id_seq', 35, false);
select setval('public.species_in_films__id_seq', 77, false);
select setval('public.pilots__id_seq', 45, false);
select setval('public.starship_specs__id_seq', 39, false);