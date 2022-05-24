SELECT * FROM "AwsDataCatalog"."test"."alltweets" 
WHERE "created_at" > NOW() - INTERVAL '1' HOUR ;

----------

SELECT "player_full_name", COUNT(*) FROM "AwsDataCatalog"."test"."alltweets" 
WHERE "created_at" > NOW() - INTERVAL '24' HOUR
GROUP BY "player_full_name" ORDER BY COUNT(*) DESC LIMIT 3;

----------

SELECT "player_full_name", COUNT(*), RANK() over (ORDER BY COUNT(*) DESC) FROM "AwsDataCatalog"."test"."alltweets" 
WHERE "created_at" > NOW() - INTERVAL '24' HOUR AND "sentiment"='POSITIVE'
GROUP BY "player_full_name" ORDER BY COUNT(*) DESC LIMIT 3;

----------

SELECT "player_full_name", COUNT(*) FROM "AwsDataCatalog"."test"."alltweets" 
WHERE "sentiment"='NEGATIVE'
GROUP BY "player_full_name" ORDER BY COUNT(*) DESC;

----------

SELECT "player_full_name", COUNT(*), RANK() over (ORDER BY COUNT(*) DESC) FROM "AwsDataCatalog"."test"."alltweets" 
WHERE "created_at" > NOW() - INTERVAL '24' HOUR
GROUP BY "player_full_name";
