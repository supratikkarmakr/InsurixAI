from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path

class Settings(BaseSettings):
    app_name: str = "Car Damage Detection API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Model paths - using absolute path based on current file location
    model_dir: str = str(Path(__file__).parent.parent / "models")
    classification_model: str = "car_damage_classification_model.h5"
    location_model: str = "ft_model_locn.h5"
    feature_model: str = "ft_model.h5"
    
    # API settings
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = ["jpg", "jpeg", "png", "webp"]
    
    # CORS settings
    allowed_origins: List[str] = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings() 