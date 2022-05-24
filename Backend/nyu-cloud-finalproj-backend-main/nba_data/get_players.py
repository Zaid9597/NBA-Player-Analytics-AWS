#https://github.com/swar/nba_api
from nba_api.stats.static import players
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('nba_players')

res = players.get_active_players()
for player in res:
    table.put_item(Item=player)
