from datetime import datetime, timedelta

import os

from jose import jwt, JWTError

from passlib.context import CryptContext

from fastapi import Depends, HTTPException

from fastapi.security import OAuth2PasswordBearer

from dotenv import load_dotenv


load_dotenv()


SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="users/login"
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password):

    return pwd_context.hash(
        password
    )


def verify_password(

    plain_password,

    hashed_password

):

    return pwd_context.verify(

        plain_password,

        hashed_password

    )


def create_access_token(

    data: dict

):

    to_encode = data.copy()

    expire = (

        datetime.utcnow()

        + timedelta(

            minutes=ACCESS_TOKEN_EXPIRE_MINUTES

        )

    )

    to_encode.update(

        {"exp": expire}

    )

    return jwt.encode(

        to_encode,

        SECRET_KEY,

        algorithm=ALGORITHM

    )


def get_current_user_email(

    token: str = Depends(

        oauth2_scheme

    )

):

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[

                ALGORITHM

            ]

        )

        email = payload.get(

            "sub"

        )

        if not email:

            raise HTTPException(

                status_code=401,

                detail="Invalid token"

            )

        return email

    except JWTError:

        raise HTTPException(

            status_code=401,

            detail="Invalid token"

        )