
# PediPal : A Pediatrician App for Mothers and Pregnant Women

Pedipal is an innovative mobile application designed to support mothers and pregnant women with reliable, personalized healthcare assistance. Built with React Native, MongoDB, Gemini API, Llama, QRoq, and Neo4j, Pedipal provides a holistic experience to its users through advanced AI-driven features.
## Features

1. #### Intelligent Chatbot (RAG-Based)
A conversational assistant that uses Retrieval-Augmented Generation (RAG) to answer user queries about health, nutrition, and childcare.
Provides accurate and relevant responses by retrieving up-to-date information and generating personalized answers.

2. #### Personalized Diet Generator
Dynamically generates diet plans tailored to the user's taste preferences.
Features include:
Taste Preference Tracking: Records user feedback and updates taste preferences using weighted algorithms.
Adaptive Recommendations: Regular updates ensure recommendations align with user preferences over time.

3. #### Image-Based Nutrient Detector
Users can upload images of food, and the app analyzes them to:
Identify if the item is food.
Provide detailed nutritional value of the identified food item.
## Tech Stack

**Frontend**

- React Native: For building a seamless and cross-platform mobile experience.

**Backend**

- FastAPI: To create efficient and scalable RESTful APIs for handling requests.

- MongoDB: To store user data and weekly taste pallet that was generated.

- Neo4j: To store taste preferences of the user.

## API Reference

The following APIs and libraries are used to power Pedipal's advanced features:

#### Core APIs and Tools
- FastAPI: Efficient backend framework for API development.
- Groq API: Used for fast retrieval of responses from the llm.
- Gemini API: Used for accurate food nutrient detection from images.



## Installation

#### Prerequisites:

- Node.js (v14 or above)
- MongoDB
- Neo4j Database
- Python 3.9 or above (for FastAPI)

#### Steps to Run
1. Clone the repository.

```bash
git clone <repository-url>
cd pedipal

```

2. Install dependencies for both the frontend and backend:

```bash
npm install

```

```bash
pip install -r requirements.txt

```
## Usage/Examples

- Login/Sign Up: Users create an account or log in to access personalized features.
- Chatbot Assistance: Use the chatbot to ask questions about pregnancy, child health, or nutrition.
- Diet Generator: Provide feedback on your dietary preferences and receive customized meal plans.
- Nutrient Analysis: Upload food images to view nutritional information.

