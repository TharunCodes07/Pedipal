import os
from groq import Groq
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import dotenv

dotenv.load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name='llama-3.3-70b-versatile'
)

def get_template(age,isPregnant):
    if isPregnant=="true":
        return '''
        You are an "Indian" diet planning assistant for pregnant women. Make sure that the food that you generate are pregnancy-friendly and provide only Indian dishes. Based on the following taste preferences for each day, create a detailed and nutritionally balanced meal plan (breakfast, lunch, and dinner) for each day with actually edible healthy food names as per the requested flavors. The plan should include specific food items that match the taste combinations provided. You must use real foods that are suitable for pregnant women in their {age}th month of pregnancy and ensure that the meal is "simple and practical".

        The output should not contain any taste name explicitly, avoid non-vegetarian/hard to digest food items and make the foods easy to eat for a pregnant woman.

        Here's an example format of what is expected for Day 1:
        - **Breakfast**: Greek yogurt with honey and strawberries, and a slice of whole wheat bread.
        - **Lunch**: Lentil soup with mixed vegetables, brown rice, and a small portion of paneer.
        - **Dinner**: Baked sweet potato, steamed spinach, and a small portion of grilled fish.

        Now generate a complete meal plan with a list of actual food names for each day, providing **actual foods** for each meal in the above format.

        Here is the reference taste preferences for each day, refer to them and create the meal plan:

        Day 1: {day1}
        Day 2: {day2}
        Day 3: {day3}
        Day 4: {day4}
        Day 5: {day5}
        Day 6: {day6}
        Day 7: {day7}
        '''
    elif isPregnant=="false" and age <= 2:
        return '''
        You are a "Indian" diet planning assistant for children. Make sure that the food that u generate are babies friendly and provide only Indian dishes. Based on the following taste preferences for each day, create a detailed and nutritionally balanced meal plan (breakfast, lunch, and dinner) for each day with actually edible healthy food names as per the rewuested flavours. The plan should include specific food items that match the taste combinations provided. You must use real foods that are suitable for children and ensure that the meal is "simple and practical". 

        the output should not contain any taste name explicitly, avoid non-vergetarian/hard to digest food items and make the foods  easy to eat for a {age} year old child.

        Here's an example format of what is expected for Day 1:
        - **Breakfast**: Greek yogurt with honey and strawberries , and a slice of sourdough bread .
        - **Lunch**: Grilled chicken with lemon , quinoa , and sautéed mushrooms .
        - **Dinner**: Roasted salmon , mashed sweet potatoes , and a side of steamed broccoli .

        Now generate a complete meal plan with a list of actual food names for each day, providing **actual foods** for each meal in the above format.

        Here is the reference taste preferences for each day, refer to them and  create the meal plan:

        Day 1: {day1}
        Day 2: {day2}
        Day 3: {day3}
        Day 4: {day4}
        Day 5: {day5}
        Day 6: {day6}
        Day 7: {day7}
        '''
    
    elif isPregnant=="false" and age <= 1:
        return '''
        You are an "Indian" diet planning assistant for infants. Ensure that the food you suggest is soft, easy to digest, and safe for babies under 1 year. The meals must consist of age-appropriate, healthy Indian dishes. Create a detailed and nutritionally balanced meal plan (breakfast, lunch, and dinner) for each day using real, baby-safe foods based on the following taste preferences for each day.

        The meal plan should be well-suited to a {age} year-old baby, and should exclude salt, sugar, honey, or any potential allergens unless the baby has already been introduced to them.

        Here are the taste preferences for each day in the format [Breakfast Flavor, Lunch Flavor, Dinner Flavor]. Create the meal plan using real foods that match the flavors without explicitly mentioning the taste names:

        Day 1: {day1}
        Day 2: {day2}
        Day 3: {day3}
        Day 4: {day4}
        Day 5: {day5}
        Day 6: {day6}
        Day 7: {day7}

        Example format for Day 1:

        Breakfast: Rice porridge with mashed banana and a small drizzle of breast milk/formula.
        Lunch: Steamed and mashed carrot with a soft cooked lentil puree.
        Dinner: Soft mashed potato with mashed peas and a little homemade ghee.

        Now generate a complete meal plan with a list of actual baby-friendly food names for each meal in the above format, ensuring each meal is balanced and nutritious while being appropriate for babies under 1 year.
        '''
    

    elif isPregnant=="false" and age > 2:
        return '''
        You are a "Indian" diet planning assistant for children. Make sure that the food that u generate are babies friendly and also Indian dishes. Based on the following taste preferences for each day, create a detailed and nutritionally balanced meal plan (breakfast, lunch, and dinner) for each day with actually edible healthy food names as per the rewuested flavours. The plan should include specific food items that match the taste combinations provided. You must use real foods that are suitable for children and ensure variety.

        the output should not contain any taste name explicitly, create a detailed and nutritionally balanced meal plan suitable for a {age} year-old child
        
        Here is the reference taste preferences for each day in the format [Breakfast Flavor, Lunch Flavor, Dineer Flavor], refer to them and create the meal plan, make sure that the food u provide for that meal is predominantly based on the flavor provided:

        Day 1: {day1}
        Day 2: {day2}
        Day 3: {day3}
        Day 4: {day4}
        Day 5: {day5}
        Day 6: {day6}
        Day 7: {day7}

        Here's an example format of what is expected for Day 1:

        Breakfast: Soft moong dal khichdi (lentil and rice porridge) with mashed carrots and a small dollop of ghee.
        Lunch: Mildly spiced grilled chicken (shredded for easy chewing) with mashed sweet potatoes and soft-cooked spinach (pureed or finely chopped).
        Dinner: Paneer (cottage cheese) cubes sautéed in a little ghee, served with mashed pumpkin and soft, steamed green beans.

        Now generate a complete meal plan with a list of actual food names for each day, providing **actual foods** for each meal in the above format emphasizing on the flavor.
        '''
        

def generate_diet_plan(diet_plan, age,isPregnant):
    template = get_template(age,isPregnant)
    prompt = PromptTemplate(
        input_variables=["age", "day1", "day2", "day3", "day4", "day5", "day6", "day7"],
        template=template
    )
    
    conversation = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=False
    )
    
    return conversation.predict(
        age=age,
        day1=diet_plan[0],
        day2=diet_plan[1],
        day3=diet_plan[2],
        day4=diet_plan[3],
        day5=diet_plan[4],
        day6=diet_plan[5],
        day7=diet_plan[6]
    )

# Example usage (commented out)
# if __name__ == "__main__":
#     example_diet_plan = [
#         ["sweet", "sour", "umami"],
#         ["bitter", "sweet", "sour"],
#         ["umami", "bitter", "sweet"],
#         ["sour", "umami", "bitter"],
#         ["sweet", "sour", "umami"],
#         ["bitter", "sweet", "sour"],
#         ["umami", "bitter", "sweet"]
#     ]
#     result = generate_diet_plan(example_diet_plan, 6)
#     print(result)