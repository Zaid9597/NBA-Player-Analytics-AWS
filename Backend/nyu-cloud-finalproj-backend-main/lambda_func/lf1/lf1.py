import json
import boto3
import datetime
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

#comprehand config
comprehend = boto3.client(service_name='comprehend', region_name='us-east-1')
lang='en'

#s3 config
s3client = boto3.client('s3')
bucketName = 'nyucloudfinalproj'
src = 'enriche-tweets/'

#sqs config
sqs = boto3.resource('sqs')
queue = sqs.Queue('https://sqs.us-east-1.amazonaws.com/617440612116/tweets-comprehend-processing.fifo')

def comprehend_tweet(tweetObj):
    text = tweetObj['text']
    comprehend_res = comprehend.detect_entities(Text=text, LanguageCode=lang)
    entities = comprehend_res['Entities']
    enriche_tweets = []
    detectedPeople = []
    for entity in entities:
        if entity['Type']=='PERSON' and entity['Score']>0.5:
            detectedPeople.append(entity['Text'])
            
    if len(detectedPeople)>0:
        sentiment = comprehend.detect_sentiment(Text=text, LanguageCode=lang)
        #tweetObj['sentiment'] = sentiment["Sentiment"]
        #tweetObj['people'] = detectedPeople
        #return tweetObj
        for person in detectedPeople:
            enriche_tweet = {}
            enriche_tweet['playerName'] = person
            enriche_tweet['sentiment'] = sentiment["Sentiment"]
            enriche_tweet['id'] = tweetObj['id']
            enriche_tweet['created_at'] = tweetObj['created_at']
            enriche_tweet['text'] = text
            enriche_tweets.append(enriche_tweet)
    return enriche_tweets
                
def lambda_handler(event, context):
    #messages = queue.receive_messages(AttributeNames=['All'], MessageAttributeNames=['All'],MaxNumberOfMessages=10,VisibilityTimeout=300,WaitTimeSeconds=10)
    records = event['Records']
    enriche_tweets = []
    for record in records:
        message = record['body']
        raw_tweets = json.loads(message)
        for raw_tweet in raw_tweets:
            analzyedTweets = comprehend_tweet(raw_tweet)
            # if analzyedTweets is not None:
            #     enriche_tweets.append(analzyedTweets)
            enriche_tweets.extend(analzyedTweets)
        #message.delete()
        
    if len(enriche_tweets)>0:
        todayStr = datetime.datetime.today().strftime("%d-%m-%Y")
        timeStr = datetime.datetime.today().strftime("%H-%M-%S")
        filename = src+todayStr+"/"+timeStr+".json"
        body = json.dumps(enriche_tweets)
        s3client.put_object(Body=body, Bucket=bucketName, Key=filename)

    return {
        'statusCode': 200,
        'body': json.dumps(len(enriche_tweets))
    }
