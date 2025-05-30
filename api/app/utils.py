from fastapi import UploadFile, HTTPException
from typing import Dict, Any
from .config import settings
import logging
import time

logger = logging.getLogger(__name__)

async def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded image file"""
    
    # Check file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed: {', '.join(settings.allowed_extensions)}"
        )
    
    # Check file size
    file_content = await file.read()
    if len(file_content) > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size: {settings.max_file_size // (1024 * 1024)}MB"
        )
    
    # Reset file pointer
    await file.seek(0)

def format_response(prediction_result: Dict[str, Any], include_probabilities: bool = False) -> Dict[str, Any]:
    """Format prediction response"""
    response = {
        "success": True,
        "data": {
            "predicted_class": prediction_result["class"],
            "confidence": round(prediction_result["confidence"], 4),
            "confidence_percentage": f"{prediction_result['confidence']:.1%}"
        },
        "metadata": {
            "model_version": "1.0.0",
            "timestamp": time.time()
        }
    }
    
    if include_probabilities:
        response["data"]["all_probabilities"] = prediction_result.get("all_probabilities", {})
    
    return response

def format_comprehensive_response(analysis_result: Dict[str, Any], include_probabilities: bool = False) -> Dict[str, Any]:
    """Format comprehensive analysis response"""
    response = {
        "success": True,
        "data": {},
        "metadata": {
            "model_version": "1.0.0",
            "timestamp": time.time(),
            "models_used": list(analysis_result.keys())
        }
    }
    
    # Add damage classification if available
    if 'damage_classification' in analysis_result:
        damage_data = analysis_result['damage_classification']
        response["data"]["damage_severity"] = {
            "predicted_class": damage_data["class"],
            "confidence": round(damage_data["confidence"], 4),
            "confidence_percentage": f"{damage_data['confidence']:.1%}"
        }
        if include_probabilities:
            response["data"]["damage_severity"]["all_probabilities"] = damage_data.get("all_probabilities", {})
    
    # Add location data if available
    if 'damage_location' in analysis_result:
        location_data = analysis_result['damage_location']
        response["data"]["damage_location"] = {
            "predicted_location": location_data["location"],
            "confidence": round(location_data["confidence"], 4),
            "confidence_percentage": f"{location_data['confidence']:.1%}"
        }
        if include_probabilities:
            response["data"]["damage_location"]["all_probabilities"] = location_data.get("all_probabilities", {})
    
    # Add feature data if available
    if 'features' in analysis_result:
        feature_data = analysis_result['features']
        response["data"]["features"] = {
            "feature_count": feature_data["feature_count"],
            "extracted": True
        }
        # Only include raw features if specifically requested
        if include_probabilities:  # Using this flag to also control feature inclusion
            response["data"]["features"]["raw_features"] = feature_data["features"]
    
    # Add overall confidence
    if 'overall_confidence' in analysis_result:
        response["data"]["overall_confidence"] = {
            "score": round(analysis_result["overall_confidence"], 4),
            "percentage": f"{analysis_result['overall_confidence']:.1%}"
        }
    
    return response

def create_error_response(error_message: str, error_code: str = "PREDICTION_ERROR") -> Dict[str, Any]:
    """Create standardized error response"""
    return {
        "success": False,
        "error": {
            "code": error_code,
            "message": error_message,
            "timestamp": time.time()
        }
    } 