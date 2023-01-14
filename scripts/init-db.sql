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