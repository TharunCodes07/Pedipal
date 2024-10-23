# %pip install neo4j

from neo4j import GraphDatabase

# Establish connection to the Neo4j database
class Neo4jConnection:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters)
            return result.data()


conn = Neo4jConnection(uri="bolt://localhost:7687", user="PediPal", password="12345678")

def create_user_taste_graph(conn, user_id):
    create_user_query = """
    MERGE (u:User {id: $user_id})
    WITH u
    FOREACH (taste IN ['sweet', 'sour', 'bitter', 'umami'] | 
        MERGE (t:Taste {name: taste})
        MERGE (u)-[:LIKES {weight: 0}]->(t)
    )
    """
    conn.query(create_user_query, parameters={"user_id": user_id})


# create_user_taste_graph(conn, "user_123")


def update_taste_weight(conn, user_id, taste_category, review_score):
    weight_change = review_score - 2.5  

    update_weight_query = """
    MATCH (u:User {id: $user_id})-[r:LIKES]->(t:Taste {name: $taste_category})
    SET r.weight = r.weight + $weight_change
    """
    conn.query(update_weight_query, parameters={"user_id": user_id, "taste_category": taste_category, "weight_change": weight_change})



import random
import math

def generate_weighted_diet_plan(conn, user_id):
    print(user_id)

    query = """
    MATCH (u:User {gmail: $user_id})-[r:LIKES]->(t:Taste)
    RETURN t.name AS taste, r.weight AS weight
    """

    
    result = conn.query(query, parameters={"user_id": user_id})
    print(result)
    # Step 2: Normalize weights and calculate total weight
    tastes = [(item['taste'], max(1, item['weight'])) for item in result]
    total_weight = sum([taste[1] for taste in tastes])

    # Step 3: Determine the number of appearances each taste should have over 21 meals
    total_meals = 21  # 3 meals a day for 7 days
    taste_appearances = {}
    remaining_meals = total_meals
    
    
    for taste, weight in tastes:
        appearances = math.floor((weight / total_weight) * total_meals)
        taste_appearances[taste] = appearances
        remaining_meals -= appearances

    
    weighted_tastes = sorted(tastes, key=lambda x: x[1], reverse=True)  
    i = 0
    while remaining_meals > 0:
        taste = weighted_tastes[i % len(weighted_tastes)][0]
        taste_appearances[taste] += 1
        remaining_meals -= 1
        i += 1


    taste_pool = []
    for taste, count in taste_appearances.items():
        taste_pool.extend([taste] * count)


    random.shuffle(taste_pool)

    weekly_plan = []
    
    for day in range(7):  
        daily_plan = []
        available_tastes = set(taste_pool)  
        
        for _ in range(3):
            if not available_tastes:  
                available_tastes = set(taste_pool)  

            taste = random.choice(list(available_tastes))  
            available_tastes.remove(taste)  
            taste_pool.remove(taste)  

            daily_plan.append(taste)

        weekly_plan.append(daily_plan)

    return weekly_plan