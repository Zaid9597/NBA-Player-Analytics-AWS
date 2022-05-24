import boto3
import json
import time

sns = boto3.client('sns')
athena = boto3.client('athena')
quicksight = boto3.client('quicksight')
cognito = boto3.client('cognito-idp')
cognitoUserpoolId = 'us-east-1_U3DZNzdcw'

dynamo = boto3.client('dynamodb')

def getQuickSightUrl():
    response = quicksight.generate_embed_url_for_registered_user(
        AwsAccountId='617440612116',
        SessionLifetimeInMinutes=600,
        UserArn='arn:aws:quicksight:us-east-1:617440612116:user/default/617440612116',
        ExperienceConfiguration={
            'Dashboard': {'InitialDashboardId': '6ccb3230-44ce-4c47-af10-ae80c12bd1fc'}
        }
    )
    return response
        

def get_var_char_values(d):
    return [obj['VarCharValue'] if 'VarCharValue' in obj else None for obj in d['Data']]
    
def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        },
    }

def getTopPlayersHandler(params):
    if params is None:
        return getTopPlayers()
    interval = int(params['interval']) if 'interval' in params else 1
    number = params['count'] if 'count' in params else 3
    sentiment = params['sentiment'] if 'sentiment' in params else None
    return getTopPlayers(interval, number, sentiment)
    
def getTopPlayers(interval=1, number=3, sentiment=None):
    queryStringTemplate = "WITH temp1 AS (SELECT \"player_full_name\", COUNT(*) as count, \
        RANK() over (ORDER BY COUNT(*) DESC) as ranking FROM \"AwsDataCatalog\".\"test\".\"alltweets\" \
        WHERE \"created_at\" > NOW() - INTERVAL '{}' HOUR \
        AND \"sentiment\"={} \
        GROUP BY \"player_full_name\" ORDER BY COUNT(*) DESC LIMIT {}), \
        temp2 AS (SELECT \"player_full_name\", COUNT(*) as past_count, \
        RANK() over (ORDER BY COUNT(*) DESC) as past_ranking FROM \"AwsDataCatalog\".\"test\".\"alltweets\" \
        WHERE \"created_at\" > NOW() - INTERVAL '{}' HOUR AND \"created_at\" <= NOW() - INTERVAL '{}' HOUR \
        AND \"sentiment\"={} \
        GROUP BY \"player_full_name\" ORDER BY COUNT(*) DESC) \
        SELECT temp1.*, past_count, past_ranking FROM temp1 LEFT OUTER JOIN temp2 ON temp1.\"player_full_name\"=temp2.\"player_full_name\";"
    if sentiment is None:
        sentiment = '\"sentiment\"'
    else:
        sentiment = "'"+sentiment+"'"
    queryString = queryStringTemplate.format(interval,sentiment,number,2*interval,interval,sentiment)
    s3location, athenaResult = queryAthena(queryString)
    return athenaResult

def getPlayerHandler(params):
    if params is None:
        return None
    fullname = params['fullname']
    start = int(params['starttime']) if 'starttime' in params else 10000
    end = int(params['endtime']) if 'endtime' in params else 0
    return getPlayer(fullname,start,end)

def getPlayer(fullname,start,end):
    result={}
    queryStringTemplate = "SELECT \"player_full_name\", count, ranking \
        FROM (SELECT \"player_full_name\", COUNT(*) as count, \
        RANK() over (ORDER BY COUNT(*) DESC) as ranking FROM \"AwsDataCatalog\".\"test\".\"alltweets\" \
        WHERE \"created_at\" > NOW() - INTERVAL '{}' HOUR AND \"created_at\" < NOW() - INTERVAL '{}' HOUR \
        GROUP BY \"player_full_name\") \
        WHERE \"player_full_name\"='{}';"
    queryString = queryStringTemplate.format(start,end,fullname)
    s3location, athenaResult = queryAthena(queryString)
    result['ALL'] = athenaResult
    
    for sentiment in ['POSITIVE','NEGATIVE','NEUTRAL']:
        queryStringTemplate = "SELECT \"player_full_name\", count, ranking \
            FROM (SELECT \"player_full_name\", COUNT(*) as count, \
            RANK() over (ORDER BY COUNT(*) DESC) as ranking FROM \"AwsDataCatalog\".\"test\".\"alltweets\" \
            WHERE \"created_at\" > NOW() - INTERVAL '{}' HOUR AND \"created_at\" < NOW() - INTERVAL '{}' HOUR \
            AND \"sentiment\"='{}' \
            GROUP BY \"player_full_name\") \
            WHERE \"player_full_name\"='{}';"
        queryString = queryStringTemplate.format(start,end,sentiment,fullname)
        s3location, athenaResult = queryAthena(queryString)
        result[sentiment] = athenaResult
    return result

def getPlayerV2Handler(params):
    if params is None or 'fullname' not in params:
        return None
    return getPlayerV2(params['fullname'])
    
def getPlayerV2(fullname):
    queryStringTemplate = "SELECT 'hour' AS interval, 'all' AS sentiment, * FROM hourstatall WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'hour' AS interval, 'positive' AS sentiment, * FROM hourstatpositive WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'hour' AS interval, 'negative' AS sentiment, * FROM hourstatnegative WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'day' AS interval, 'all' AS sentiment, * FROM daystatall WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'day' AS interval, 'positive' AS sentiment, * FROM daystatpositive WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'day' AS interval, 'negative' AS sentiment, * FROM daystatnegative WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'week' AS interval, 'all' AS sentiment, * FROM weekstatall WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'week' AS interval, 'positive' AS sentiment, * FROM weekstatpositive WHERE \"player_full_name\" = '{0}' UNION \
        SELECT 'week' AS interval, 'negative' AS sentiment, * FROM weekstatnegative WHERE \"player_full_name\" = '{0}';"
    queryString = queryStringTemplate.format(fullname)
    #-------
    queryStringTemplate = "EXECUTE playerv2query USING '{0}', '{0}','{0}','{0}','{0}','{0}';"
    queryString = queryStringTemplate.format(fullname)
    s3location, athenaResult = queryAthena(queryString)
    return athenaResult
    
def getTweetsHandler(params):
    if params is None:
        return None
    fullname = params['fullname']
    start = int(params['start']) if 'start' in params else 10000
    end = int(params['end']) if 'end' in params else 0
    number = params['count'] if 'count' in params else 3
    return getTweets(fullname,start,end,number)

def getTweets(fullname,start,end,number):
    queryStringTemplate = "(SELECT * FROM \"AwsDataCatalog\".\"test\".\"alltweets\" \
        WHERE \"player_full_name\"='{}' \
        AND \"created_at\" > NOW() - INTERVAL '{}' HOUR \
        AND \"created_at\" < NOW() - INTERVAL '{}' HOUR \
        AND \"sentiment\"='POSITIVE' ORDER BY \"created_at\" DESC LIMIT {})\n\
        UNION\n\
        (SELECT * FROM \"AwsDataCatalog\".\"test\".\"alltweets\" \
        WHERE \"player_full_name\"='{}' \
        AND \"created_at\" > NOW() - INTERVAL '{}' HOUR \
        AND \"created_at\" < NOW() - INTERVAL '{}' HOUR \
        AND \"sentiment\"='NEGATIVE' ORDER BY \"created_at\" DESC LIMIT {})\n\
        UNION\n\
        (SELECT * FROM \"AwsDataCatalog\".\"test\".\"alltweets\" \
        WHERE \"player_full_name\"='{}' \
        AND \"created_at\" > NOW() - INTERVAL '{}' HOUR \
        AND \"created_at\" < NOW() - INTERVAL '{}' HOUR \
        AND \"sentiment\"='NEUTRAL' ORDER BY \"created_at\" DESC LIMIT {});"
    queryString = queryStringTemplate.format(fullname,start,end,number,fullname,start,end,number,fullname,start,end,number)
    s3location, athenaResult = queryAthena(queryString)
    return athenaResult
    
def subscribeHandler(body):
    if 'email' not in body or 'player' not in body:
        return "without the field email or player"
    email, player = body['email'], body['player']
    player = player.replace(' ','_')
    topicArn = "arn:aws:sns:us-east-1:617440612116:"+player
    
    try:
        group = cognito.get_group(GroupName=player, UserPoolId=cognitoUserpoolId)
    except cognito.exceptions.ResourceNotFoundException as nfe:
        cognito.create_group(GroupName=player, UserPoolId=cognitoUserpoolId)
    cognito.admin_add_user_to_group(UserPoolId=cognitoUserpoolId, Username=email, GroupName=player)
        
    try:
        res = sns.get_topic_attributes(TopicArn=topicArn)
    except sns.exceptions.NotFoundException as nfe:
        res = sns.create_topic(Name=player)
        
    res = sns.subscribe(TopicArn=topicArn,Protocol='email',Endpoint=email)
    print(res)
    return res
        

def queryAthena(queryString):
    print(queryString)
    queryStart = athena.start_query_execution(
        QueryString = queryString,
        QueryExecutionContext = {
            'Database': 'test'
        }, 
        ResultConfiguration = { 'OutputLocation': 's3://aws-athena-query-results-us-east-1-617440612116'}
    )
    queryExecutionID = queryStart['QueryExecutionId']
    
    while True:
        response_get_query_details = athena.get_query_execution(QueryExecutionId=queryExecutionID)
        status = response_get_query_details['QueryExecution']['Status']['State']
        if (status == 'FAILED') or (status == 'CANCELLED') :
            failure_reason = response_get_query_details['QueryExecution']['Status']['StateChangeReason']
            print(failure_reason)
            return False, False
        elif status == 'SUCCEEDED':
            location = response_get_query_details['QueryExecution']['ResultConfiguration']['OutputLocation']

            ## Function to get output results
            response_query_result = athena.get_query_results(QueryExecutionId = queryExecutionID)
            print(response_query_result)
            result_data = response_query_result['ResultSet']
            
            if len(response_query_result['ResultSet']['Rows']) > 1:
                header = response_query_result['ResultSet']['Rows'][0]
                rows = response_query_result['ResultSet']['Rows'][1:]
                header = [obj['VarCharValue'] for obj in header['Data']]
                result = [dict(zip(header, get_var_char_values(row))) for row in rows]
                return location, result
            else:
                return location, None
        else:
            time.sleep(5)

def getSubscribeHandler(params):
    if params is None or 'username' not in params:
        return None
    username = params['username']
    response = cognito.admin_list_groups_for_user(
        Username=username,
        UserPoolId=cognitoUserpoolId
    )
    print(response)
    return [obj['GroupName'].replace('_',' ') for obj in response['Groups']]
    
    
def router(path,httpMethod,params=None,body=None):
    if path=="/topplayers" and httpMethod=="GET":
        return respond(None, getTopPlayersHandler(params))
    elif path=="/player" and httpMethod=="GET":
        return respond(None, getPlayerHandler(params))
    elif path=="/playerv2" and httpMethod=="GET":
        return respond(None, getPlayerV2Handler(params))
    elif path=="/tweets" and httpMethod=="GET":
        return respond(None, getTweetsHandler(params))
    elif path=="/charts" and httpMethod=="GET":
        return respond(None, getQuickSightUrl())
    elif path=="/subscribe" and httpMethod=="POST":
        return respond(None, subscribeHandler(body))
    elif path=="/subscribe" and httpMethod=="GET":
        return respond(None, getSubscribeHandler(params))
    else:
        respondBody = "Invalid http method/endpoint!"
        return respond(None, respondBody)
            
    
def lambda_handler(event, context):
    print(event)
    params = event['queryStringParameters'] if 'queryStringParameters' in event else None
    body = json.loads(event['body']) if 'body' in event and event['body'] is not None else None
    return router(event['path'],event['httpMethod'],params,body)
