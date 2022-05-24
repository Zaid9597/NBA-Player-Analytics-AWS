import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame
from pyspark.sql import functions as SqlFuncs

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Script generated for node tweets
tweets_node1647304486476 = glueContext.create_dynamic_frame.from_options(
    format_options={"jsonPath": "$[*]", "multiline": False},
    connection_type="s3",
    format="json",
    connection_options={
        "paths": ["s3://nyucloudfinalproj/enriche-tweets/"],
        "recurse": True,
    },
    transformation_ctx="tweets_node1647304486476",
)

# Script generated for node players
players_node1647305096238 = glueContext.create_dynamic_frame.from_options(
    format_options={"quoteChar": '"', "withHeader": True, "separator": ","},
    connection_type="s3",
    format="csv",
    connection_options={
        "paths": ["s3://nyucloudfinalproj/nba-player-mapping/mapping.csv"],
        "recurse": True,
    },
    transformation_ctx="players_node1647305096238",
)

# Script generated for node Join
Join_node1647305124147 = Join.apply(
    frame1=tweets_node1647304486476,
    frame2=players_node1647305096238,
    keys1=["playerName"],
    keys2=["player_identifier"],
    transformation_ctx="Join_node1647305124147",
)

# Script generated for node Drop Duplicates
DropDuplicates_node1647305189768 = DynamicFrame.fromDF(
    Join_node1647305124147.toDF().dropDuplicates(),
    glueContext,
    "DropDuplicates_node1647305189768",
)

# Script generated for node Apply Mapping
ApplyMapping_node1647305248737 = ApplyMapping.apply(
    frame=DropDuplicates_node1647305189768,
    mappings=[
        ("id", "string", "tweet_id", "string"),
        ("text", "string", "tweet_text", "string"),
        ("sentiment", "string", "sentiment", "string"),
        ("created_at", "string", "created_at", "timestamp"),
        ("player_full_name", "string", "player_full_name", "string"),
    ],
    transformation_ctx="ApplyMapping_node1647305248737",
)

# Script generated for node AWS Glue Data Catalog
AWSGlueDataCatalog_node1647305836668 = glueContext.write_dynamic_frame.from_catalog(
    frame=ApplyMapping_node1647305248737,
    database="test",
    table_name="alltweets",
    transformation_ctx="AWSGlueDataCatalog_node1647305836668",
)

job.commit()
