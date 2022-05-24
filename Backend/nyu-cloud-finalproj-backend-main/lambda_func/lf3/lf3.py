import json
import urllib3
import boto3

sns = boto3.client('sns')
http = urllib3.PoolManager()

def dispatchTopics(topics):
    for topic in topics:
        dispatchTopic(topic['TopicArn'])

def dispatchTopic(topicArn):
    name = getPlayerName(topicArn)
    print(name)
    url='https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/playerv2'
    params={"fullname":name}
    response = http.request('GET',url,fields=params)
    res_json = json.loads(response.data)
    #message = json.dumps(res_json)
    
    sns_response = sns.publish(
        TopicArn=topicArn,
        #Message=message,
        Message=json_to_emailtxt(res_json),
        Subject=name+' Daily Update',
        MessageStructure='string'
    )
    print(sns_response)
    
def getPlayerName(topicArn):
    words = topicArn.split(':')
    name = words[-1].replace('_',' ')
    return name

def json_to_emailtxt(json_file):
    print("body: ", json_file)
    f0 = json_file[0]
    f1 = json_file[1]
    f2 = json_file[2]
    f3 = json_file[3]
    f4 = json_file[4]
    f5 = json_file[5]
    print("f1: ",f1)
    print(f1['player_full_name'])
    l1 = ['Know what is brewing about your favorite player on Twitter!']

    l2 = ['Today ',f1['player_full_name'],
          ' received a total of ',f1['count'],' neutral tweets',', ',f0['count'],' positive tweets and ',f2['count'],
          ' negative tweets as compared to the tweets received yesterday i.e. ',f1['past_count'],' neutral tweets',', ',f0['past_count'],
          ' positive tweets and ',f2['past_count'],' negative tweets. His current rankings as of today are ',f1['ranking'],', ',f0['ranking'],', ',f2['ranking'],
          ',for neutral, postive and negative tweets respectively as compared to his rankings yesterday which were ',
          f1['past_ranking'],', ',f0['past_ranking'],', ',f2['past_ranking'],' for the respective category of tweets.']

    l3 = ['Summarizing the tweets for the previous week ',f1['player_full_name'],
          ' received a total of ',f3['count'],' neutral tweets',', ',f4['count'],' positive tweets and ',f5['count'],
          ' negative tweets as compared to the tweets received last week i.e.',f3['past_count'],' neutral tweets ',', ',f4['past_count'],
          ' positive tweets and ',f5['past_count'],' negative tweets. His current rankings as of this week are ',f3['ranking'],', ',f4['ranking'],', ',f5['ranking'],
          ', for neutral, postive and negative tweets respectively as compared to his rankings for the previous week which were ',
          f3['past_ranking'],', ',f4['past_ranking'],', ',f5['past_ranking'],' for the respective category of tweets.']

    mystringl1 = ''.join([str(item) for item in l1])
    mystringl2 = ''.join([str(item) for item in l2])
    mystringl3 = ''.join([str(item) for item in l3])

    mystring = '\n\n'.join([mystringl1, mystringl2, mystringl3])
    return mystring
      
def lambda_handler(event, context):
    list_topic_res = sns.list_topics()
    topics = list_topic_res['Topics']
    dispatchTopics(topics)
    nextToken = list_topic_res['NextToken'] if 'NextToken' in list_topic_res else None
    while nextToken is not None:
        list_topic_res = sns.list_topics(nextToken)
        topics = list_topic_res['Topics']
        dispatchTopics(topics)
        nextToken = list_topic_res['NextToken'] if 'NextToken' in list_topic_res else None
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
