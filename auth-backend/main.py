from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

# CREATE APP 

app = FastAPI()

# ADD MIDDLEWARE

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CONFIG

SECRET_KEY = "mysecretkey123"  # move to .env later
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 1

security = HTTPBearer()

# DATABASE (MongoDB)

client = MongoClient("mongodb://localhost:27017/")
db = client["auth_db"]
users_collection = db["users"]

# PASSWORD HASHING

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# JWT FUNCTIONS

def create_token(data: dict):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload.update({"exp": expire})

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token=Depends(security)):
    try:
        decoded = jwt.decode(
            token.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return decoded

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

# MODELS

class User(BaseModel):
    email: str
    password: str

# ROUTES

@app.get("/")
def home():
    return {"message": "Auth backend running 🚀"}


# SIGNUP

@app.post("/signup")
def signup(user: User):
    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)

    users_collection.insert_one({
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    })

    return {"message": "User created successfully"}


# LOGIN

@app.post("/login")
def login(user: User):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_token({
        "user_id": str(db_user["_id"]),
        "email": db_user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# PROTECTED DASHBOARD

@app.get("/dashboard")
def dashboard(user=Depends(get_current_user)):
    return {
        "message": "Welcome to your dashboard 🔐",
        "user": user
    }
    

# GET ALL USERS (for testing only, never do this in production)

@app.get("/users")
def get_users():
    users = users_collection.find()

    result = []
    for user in users:
        result.append({
            "id": str(user["_id"]),
            "email": user["email"]
            # ❌ never return password
        })

    return result