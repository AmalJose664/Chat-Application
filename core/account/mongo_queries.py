
def get_query_for_user_data(user):
	pipeline = [
			{
				'$match':{
					'_id': user.id
					}
			},
			{ 
				'$project':{
					'_id':0,
					'friends_count': {
						'$size':'$friends'
						},
					'pending_f_requests':{
						'$size':'$request'}
					} 
			}
		]
	return pipeline

def get_query_for_message_data(user):
	pipeline = [
			{'$match':{
				 '$or':[
						{'s': user.id},
						{'r':user.id}
					   ]  
					}
			},
			{ '$group':{
				 '_id':'null',
				 'sent_count': {
					 '$sum' : { 
						 '$cond': [
							 {'$eq':["$s",user.id]}, 1,0 ] 
						} 
					},
				'receive_count':{
					'$sum' : { 
						'$cond': [
							{'$eq':["$r",user.id]}, 1,0 ] 
						} 
					},
				'unread_count': {
					'$sum':{ 
						'$cond': [ 
							{ '$and':[ 
								{'$eq':['$r',user.id ]},
								{'$in':['$sa',[0,1]],} 
								]},1,0 
							]
						} 
					} 
				} 
			},
			{ 
				'$lookup':{
					'from': 'conversations_mongo',
					'let':{
						'user_id': user.id 
						},
					'pipeline':[ 
							{
								'$match':{
									'$expr':{
										'$in':["$$user_id", "$prtcpnt"] 
										}  
									}
							},
							{
								'$sort':{'t':-1}
							}, 
							{
								'$limit':1
							},
							{
								'$project': { 'lst_m':1, '_id':0}
							}, 
					],
					'as':'last_message', 
				}
			},
			{ 
				'$lookup':{ 
					'from':'conversations_mongo',
					'let':{
						'user_id': user.id 
						},
					'pipeline': [ 
						{
							'$match':{ 
								'$expr':{
									'$in':["$$user_id", "$prtcpnt"] 
									}  
								}
						}, 
						{ 
							'$count':"total_conversations"
						} 
					],
					'as':"total_conversations"  
				}
			},  
			{ 
				'$addFields':{
					'last_message':{
						'$ifNull':[ 
							{
								'$arrayElemAt':["$last_message.lst_m",0 ] 
							},'null' 
						] 
					},
					'total_conversations': {
						'$ifNull':[{ 
							'$arrayElemAt':["$total_conversations.total_conversations",0]
							},0 ]
					} 
				} 
			}
		]
	return pipeline


