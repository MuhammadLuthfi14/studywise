from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    secret_key: str = "dev-secret-key-change-me"
    database_url: str = "sqlite:///./studywise.db"
    cors_origins: str = "http://localhost:5173"
    access_token_expire_minutes: int = 60 * 8
    jwt_algorithm: str = "HS256"
    jwt_issuer: str = "studywise-backend"
    jwt_audience: str = "studywise-frontend"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
