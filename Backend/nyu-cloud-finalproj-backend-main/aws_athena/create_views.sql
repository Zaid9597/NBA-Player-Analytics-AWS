CREATE OR REPLACE VIEW "daystatall" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ("created_at" > ("now"() - INTERVAL  '24' HOUR))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '48' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '24' HOUR)))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "daystatnegative" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '24' HOUR)) AND ("sentiment" = 'NEGATIVE'))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ((("created_at" > ("now"() - INTERVAL  '48' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '24' HOUR))) AND ("sentiment" = 'NEGATIVE'))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "daystatpositive" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '24' HOUR)) AND ("sentiment" = 'POSITIVE'))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ((("created_at" > ("now"() - INTERVAL  '48' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '24' HOUR))) AND ("sentiment" = 'POSITIVE'))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "hourstatall" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '1' HOUR)) AND ("sentiment" = "sentiment"))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ((("created_at" > ("now"() - INTERVAL  '2' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '1' HOUR))) AND ("sentiment" = "sentiment"))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "hourstatnegative" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '1' HOUR)) AND ("sentiment" = 'NEGATIVE'))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ((("created_at" > ("now"() - INTERVAL  '2' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '1' HOUR))) AND ("sentiment" = 'NEGATIVE'))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "hourstatpositive" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '1' HOUR)) AND ("sentiment" = 'POSITIVE'))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ((("created_at" > ("now"() - INTERVAL  '2' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '1' HOUR))) AND ("sentiment" = 'POSITIVE'))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "weekstatall" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ("created_at" > ("now"() - INTERVAL  '168' HOUR))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '336' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '168' HOUR)))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "weekstatnegative" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '168' HOUR)) AND ("sentiment" = 'NEGATIVE'))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ((("created_at" > ("now"() - INTERVAL  '336' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '168' HOUR))) AND ("sentiment" = 'NEGATIVE'))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));

CREATE OR REPLACE VIEW "weekstatpositive" AS 
WITH
  temp1 AS (
   SELECT
     "player_full_name"
   , "count"(*) count
   , "rank"() OVER (ORDER BY "count"(*) DESC) ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE (("created_at" > ("now"() - INTERVAL  '168' HOUR)) AND ("sentiment" = 'POSITIVE'))
   GROUP BY "player_full_name"
) 
, temp2 AS (
   SELECT
     "player_full_name"
   , "count"(*) past_count
   , "rank"() OVER (ORDER BY "count"(*) DESC) past_ranking
   FROM
     "AwsDataCatalog"."test"."alltweets"
   WHERE ((("created_at" > ("now"() - INTERVAL  '336' HOUR)) AND ("created_at" <= ("now"() - INTERVAL  '168' HOUR))) AND ("sentiment" = 'POSITIVE'))
   GROUP BY "player_full_name"
   ORDER BY "count"(*) DESC
) 
SELECT
  temp1.*
, past_count
, past_ranking
FROM
  (temp1
LEFT JOIN temp2 ON (temp1."player_full_name" = temp2."player_full_name"));
