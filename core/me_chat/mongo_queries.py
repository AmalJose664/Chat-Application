

def get_query_for_conv(user, limit):
	pipeline = [
			{"$match": {
				"prtcpnt": {
					"$all": [user.id]
					}
				}
			},

			

			{"$sort": {"t": -1}
			},

			{"$limit": limit},
			
			{"$addFields": {
					"other_user": {
						"$arrayElemAt": [
							{
								"$filter": {
									"input": "$prtcpnt",
									"as": "user",
									"cond": {"$ne": ["$$user", user.id]}
								}
							},
							0
						]
					}
				}
			},
			{
				"$lookup": {
					"from": "user_mongo",
					"localField": "prtcpnt",
					"foreignField": "_id",
					"as": "prtcpnt"
				}
			},
			{
				"$lookup": {
					"from": "message_mongo",
					"let": {"user_id": user.id, "other_user": "$other_user"},
					"pipeline": [
						{
							"$match": {
								"$expr": {
									"$and": [
										{"$eq": ["$s", "$$other_user"]},
										{"$eq": ["$r", "$$user_id"]},  
										{"$in": ["$sa", [0, 1]]} 
									]
								}
							}
						},
						{"$count": "unread_messages"}
					],
					"as": "unread_count"
				}
			},
			{
				"$project": {
					"_id": 1,
					"prtcpnt": {"_id": 1, "user_name": 1, "email": 1, 'sqlite_id': 1, 'profile_picture': 1,},
					"lst_m": 1,
					"l_s": 1,
					't':1,
					"unread_count": {
						"$ifNull": [{"$arrayElemAt": ["$unread_count.unread_messages", 0]}, 0]
					}
				}
			}
		]
	return pipeline

def get_query_for_user_friends(user_id):
	pipeline = [
		{'$match':{'_id':user_id}},
		{'$lookup':{
			'from':'user_mongo',
			'foreignField':'_id',
			'localField':'friends',
			'as':'friends'}
		},
		{'$project':{
			'_id':0,
			'friends':'$friends.sqlite_id'}
		}
	]

	return pipeline
	