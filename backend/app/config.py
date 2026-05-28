import os


class Settings:
    """Small environment settings reader for the local MVP.

    Environment variables let us change values between local development and
    production hosting without editing code.
    """

    app_name: str = os.getenv("APP_NAME", "AI Data Copilot API")
    environment: str = os.getenv("ENVIRONMENT", "development")
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
