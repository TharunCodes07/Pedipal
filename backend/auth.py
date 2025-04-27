from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pymongo.errors import DuplicateKeyError
from jose import JWTError, jwt
from database import users_collection
from models import User, UserInDB, UserCreate, Token, TokenData, loginUser
from utils import verify_password, get_password_hash, create_access_token
from datetime import timedelta

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
async def get_user(username: str) -> UserInDB:
    user_data = users_collection.find_one({"email": username})
    if user_data:
        print("user data")
        return user_data
    return None
@router.post("/register", response_model=User)
async def register(user: UserCreate):
    print("Received user data:", user.dict())
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user.password)
    del user_dict["password"]
    
    # Check if user already exists
    existing_user = await get_user(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    try:
        users_collection.insert_one(user_dict)
    except Exception as e:
        print(f"Error inserting user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
    
    return user_dict
@router.post("/login")
async def login(form_data: loginUser):
    # Fetch the user from the database
    user = await get_user(form_data.username)
    print(user)
    
    # Check if user exists and if password is correct
    if not user:
        print("User not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    if not verify_password(form_data.password, user["hashed_password"]):
        print("Password incorrect")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    return {"message": "Login successful"}