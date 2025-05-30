from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import Optional
import time
import numpy as np

from .config import settings
from .model_loader import model_manager
from .utils import validate_image_file, format_response, format_comprehensive_response, create_error_response

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered car damage detection and classification API",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "status": "healthy",
        "timestamp": time.time()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_data = {
        "status": "healthy",
        "tensorflow_available": model_manager.tensorflow_available,
        "models_loaded": len(model_manager.models),
        "available_models": list(model_manager.models.keys()),
        "available_endpoints": [
            "/predict-damage", 
            "/predict-location", 
            "/extract-features",
            "/comprehensive-analysis"
        ],
        "timestamp": time.time()
    }
    
    # Add warnings if TensorFlow is not available
    if not model_manager.tensorflow_available:
        health_data["warnings"] = [
            "TensorFlow not available - ML prediction endpoints will not work",
            "This is often due to missing Visual C++ redistributables on Windows",
            "API is running but ML functionality is disabled"
        ]
        health_data["status"] = "degraded"
    
    return health_data

@app.post("/predict-damage")
async def predict_damage(
    file: UploadFile = File(...),
    include_probabilities: Optional[bool] = Query(False, description="Include all class probabilities in response")
):
    """
    Predict car damage severity from uploaded image
    
    Args:
        file: Image file (JPG, PNG, WEBP)
        include_probabilities: Include all class probabilities in response
    
    Returns:
        JSON response with damage classification and confidence
    """
    try:
        # Validate file
        await validate_image_file(file)
        
        # Read file content
        file_content = await file.read()
        
        # Make prediction
        prediction_result = model_manager.predict_damage(file_content)
        
        # Format response based on user preference
        response = format_response(prediction_result, include_probabilities)
        
        logger.info(f"Damage prediction completed: {prediction_result['class']} "
                   f"({prediction_result['confidence']:.2%})")
        
        return JSONResponse(content=response)
    
    except ValueError as e:
        logger.error(f"Model error: {e}")
        error_response = create_error_response(str(e), "MODEL_ERROR")
        return JSONResponse(content=error_response, status_code=503)
    
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        error_response = create_error_response(str(e), "PREDICTION_ERROR")
        return JSONResponse(content=error_response, status_code=500)

@app.post("/predict-location")
async def predict_location(
    file: UploadFile = File(...),
    include_probabilities: Optional[bool] = Query(False, description="Include all location probabilities in response")
):
    """
    Predict damage location from uploaded image
    
    Args:
        file: Image file (JPG, PNG, WEBP)
        include_probabilities: Include all location probabilities in response
    
    Returns:
        JSON response with damage location and confidence
    """
    try:
        # Validate file
        await validate_image_file(file)
        
        # Read file content
        file_content = await file.read()
        
        # Make prediction
        prediction_result = model_manager.predict_location(file_content)
        
        # Format response
        response = {
            "success": True,
            "data": {
                "predicted_location": prediction_result["location"],
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
        
        logger.info(f"Location prediction completed: {prediction_result['location']} "
                   f"({prediction_result['confidence']:.2%})")
        
        return JSONResponse(content=response)
    
    except ValueError as e:
        logger.error(f"Model error: {e}")
        error_response = create_error_response(str(e), "MODEL_ERROR")
        return JSONResponse(content=error_response, status_code=503)
    
    except Exception as e:
        logger.error(f"Location prediction error: {e}")
        error_response = create_error_response(str(e), "PREDICTION_ERROR")
        return JSONResponse(content=error_response, status_code=500)

@app.post("/extract-features")
async def extract_features(
    file: UploadFile = File(...),
    include_raw_features: Optional[bool] = Query(False, description="Include raw feature vector in response")
):
    """
    Extract features from uploaded image
    
    Args:
        file: Image file (JPG, PNG, WEBP)
        include_raw_features: Include raw feature vector in response
    
    Returns:
        JSON response with extracted features
    """
    try:
        # Validate file
        await validate_image_file(file)
        
        # Read file content
        file_content = await file.read()
        
        # Extract features
        feature_result = model_manager.extract_features(file_content)
        
        # Format response
        response = {
            "success": True,
            "data": {
                "feature_count": feature_result["feature_count"],
                "extracted": True
            },
            "metadata": {
                "model_version": "1.0.0",
                "timestamp": time.time()
            }
        }
        
        if include_raw_features:
            response["data"]["raw_features"] = feature_result["features"]
        
        logger.info(f"Feature extraction completed: {feature_result['feature_count']} features extracted")
        
        return JSONResponse(content=response)
    
    except ValueError as e:
        logger.error(f"Model error: {e}")
        error_response = create_error_response(str(e), "MODEL_ERROR")
        return JSONResponse(content=error_response, status_code=503)
    
    except Exception as e:
        logger.error(f"Feature extraction error: {e}")
        error_response = create_error_response(str(e), "EXTRACTION_ERROR")
        return JSONResponse(content=error_response, status_code=500)

@app.post("/comprehensive-analysis")
async def comprehensive_analysis(
    file: UploadFile = File(...),
    include_probabilities: Optional[bool] = Query(False, description="Include detailed probabilities and raw features"),
    models: Optional[str] = Query("all", description="Comma-separated list of models to use: classification,location,features or 'all'")
):
    """
    Perform comprehensive damage analysis using multiple models
    
    Args:
        file: Image file (JPG, PNG, WEBP)
        include_probabilities: Include detailed probabilities and features
        models: Which models to use (default: all)
    
    Returns:
        JSON response with comprehensive analysis results
    """
    try:
        # Validate file
        await validate_image_file(file)
        
        # Read file content
        file_content = await file.read()
        
        # Perform comprehensive analysis
        analysis_result = model_manager.comprehensive_analysis(file_content)
        
        # Filter results based on requested models
        if models != "all":
            requested_models = [m.strip() for m in models.split(",")]
            filtered_result = {}
            
            for model in requested_models:
                if model == "classification" and "damage_classification" in analysis_result:
                    filtered_result["damage_classification"] = analysis_result["damage_classification"]
                elif model == "location" and "damage_location" in analysis_result:
                    filtered_result["damage_location"] = analysis_result["damage_location"]
                elif model == "features" and "features" in analysis_result:
                    filtered_result["features"] = analysis_result["features"]
            
            # Recalculate overall confidence for filtered results
            if len(filtered_result) > 0:
                confidences = []
                if 'damage_classification' in filtered_result:
                    confidences.append(filtered_result['damage_classification']['confidence'])
                if 'damage_location' in filtered_result:
                    confidences.append(filtered_result['damage_location']['confidence'])
                if confidences:
                    filtered_result['overall_confidence'] = float(np.mean(confidences))
            
            analysis_result = filtered_result
        
        # Format response
        response = format_comprehensive_response(analysis_result, include_probabilities)
        
        logger.info(f"Comprehensive analysis completed using {len(analysis_result)} models")
        
        return JSONResponse(content=response)
    
    except ValueError as e:
        logger.error(f"Model error: {e}")
        error_response = create_error_response(str(e), "MODEL_ERROR")
        return JSONResponse(content=error_response, status_code=503)
    
    except Exception as e:
        logger.error(f"Comprehensive analysis error: {e}")
        error_response = create_error_response(str(e), "ANALYSIS_ERROR")
        return JSONResponse(content=error_response, status_code=500)

@app.exception_handler(413)
async def file_too_large_handler(request, exc):
    """Handle file size too large errors"""
    return JSONResponse(
        status_code=413,
        content={
            "success": False,
            "error": {
                "code": "FILE_TOO_LARGE",
                "message": f"File too large. Maximum size: {settings.max_file_size // (1024 * 1024)}MB",
                "max_size_mb": settings.max_file_size // (1024 * 1024),
                "timestamp": time.time()
            }
        }
    )

@app.exception_handler(400)
async def bad_request_handler(request, exc):
    """Handle bad request errors"""
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": str(exc.detail) if hasattr(exc, 'detail') else "Bad request",
                "timestamp": time.time()
            }
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    ) 