import json
import requests
import datetime
import boto3

#s3 config
s3client = boto3.client('s3')
bucketName = 'nyucloudfinalproj'
src = 'raw-tweets/'
metadataFileName = "raw-tweets/metadata.json"

#sqs config
sqs = boto3.resource('sqs')
queue = sqs.Queue('https://sqs.us-east-1.amazonaws.com/617440612116/tweets-comprehend-processing.fifo')

#twitter config
twitterURL = 'https://api.twitter.com/2/tweets/search/recent'
headers = {'Authorization': 'Your twitter API key here'}

def lambda_handler(event, context):
    tweetCounter = 0
    #oldestTS = datetime.datetime.now(datetime.timezone.utc)- datetime.timedelta(days=0, hours=0, minutes=1)
    raw_tweets_metadata_file = s3client.get_object(Bucket=bucketName, Key=metadataFileName) 
    raw_tweets_metadata = json.loads(raw_tweets_metadata_file["Body"].read().decode())
    last_tweet_id = raw_tweets_metadata['newest_id']
    print("last_tweet_id: ",last_tweet_id)
    params = {
        'query':'(nba)lang:en -is:retweet',
        'max_results':'100',
        #'start_time':oldestTS.isoformat(),
        'tweet.fields':'created_at,text,lang',
        'since_id':last_tweet_id
    }
    
    r = requests.get(twitterURL, headers=headers, params=params)
    response = r.json()
    metadata = response['meta']
    tweetCounter+=metadata['result_count']
    newest_id = metadata['newest_id']
    next_token = handleResponse(response)
    
    while next_token:
        params['next_token'] = next_token
        r = requests.get(twitterURL, headers=headers, params=params)
        response = r.json()
        metadata = response['meta']
        tweetCounter+=metadata['result_count']
        next_token = handleResponse(response)
    
    raw_tweets_metadata['newest_id'] = newest_id
    new_raw_tweets_metadata = json.dumps(raw_tweets_metadata)
    s3client.put_object(Body=new_raw_tweets_metadata, Bucket=bucketName, Key=metadataFileName)
    print("newest_id", newest_id)
    print("totalTweets: ",tweetCounter)
    return {
        'statusCode': 200,
        'body': tweetCounter
    }


def handleResponse(response):
    if 'data' not in response:
        return None
        
    tweets = response['data']
    body = json.dumps(tweets)
    metadata = response['meta']
    newest_id = metadata['newest_id']
    sqs_response = queue.send_message(
        MessageBody=body,
        MessageDeduplicationId=newest_id,
        MessageGroupId='NBA'
    )
    todayStr = datetime.datetime.today().strftime('%Y-%m-%d')
    filename = src+todayStr+"/"+newest_id+".json"
    
    #if to store raw tweets at s3, un-comment below
    #s3client.put_object(Body=body, Bucket=bucketName, Key=filename)
    
    return metadata['next_token'] if 'next_token' in metadata else None