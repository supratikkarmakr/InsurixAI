try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except ImportError as e:
    print(f"Warning: TensorFlow not available - {e}")
    TENSORFLOW_AVAILABLE = False
    tf = None

import numpy as np
from PIL import Image
import io
import logging
from pathlib import Path
from .config import settings

logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self):
        self.models = {}
        self.tensorflow_available = TENSORFLOW_AVAILABLE
        
        # Model-specific configurations
        self.model_configs = {
            'classification': {
                'input_size': (256, 256),  # Updated based on error message
                'class_names': ['minor', 'moderate', 'severe']
            },
            'location': {
                'input_size': (256, 256),  # Updated based on error message
                'class_names': ['front', 'rear', 'side', 'top']
            },
            'features': {
                'input_size': (256, 256),  # Updated based on error message
            }
        }
        
        # Legacy class names for backward compatibility
        self.class_names = {
            'damage_severity': self.model_configs['classification']['class_names'],
            'damage_location': self.model_configs['location']['class_names']
        }
        
        if self.tensorflow_available:
            self.load_models()
        else:
            logger.warning("TensorFlow not available - ML models will not be loaded")
    
    def load_models(self):
        """Load all ML models into memory"""
        try:
            model_dir = Path(settings.model_dir)
            
            # Load classification model
            classification_path = model_dir / settings.classification_model
            if classification_path.exists():
                self.models['classification'] = tf.keras.models.load_model(
                    str(classification_path)
                )
                # Auto-detect input size for classification model
                input_shape = self.models['classification'].input_shape
                self.model_configs['classification']['input_size'] = (input_shape[1], input_shape[2])
                logger.info(f"Classification model loaded - Input size: {self.model_configs['classification']['input_size']}")
            else:
                logger.warning(f"Classification model not found: {classification_path}")
            
            # Load location model
            location_path = model_dir / settings.location_model
            if location_path.exists():
                self.models['location'] = tf.keras.models.load_model(
                    str(location_path)
                )
                # Auto-detect input size for location model
                input_shape = self.models['location'].input_shape
                self.model_configs['location']['input_size'] = (input_shape[1], input_shape[2])
                logger.info(f"Location model loaded - Input size: {self.model_configs['location']['input_size']}")
            else:
                logger.warning(f"Location model not found: {location_path}")
            
            # Load feature extraction model
            feature_path = model_dir / settings.feature_model
            if feature_path.exists():
                self.models['features'] = tf.keras.models.load_model(
                    str(feature_path)
                )
                # Auto-detect input size for features model
                input_shape = self.models['features'].input_shape
                self.model_configs['features']['input_size'] = (input_shape[1], input_shape[2])
                logger.info(f"Features model loaded - Input size: {self.model_configs['features']['input_size']}")
            else:
                logger.warning(f"Feature model not found: {feature_path}")
                
            logger.info(f"Successfully loaded {len(self.models)} models")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise
    
    def _check_tensorflow_available(self, operation_name: str):
        """Check if TensorFlow is available for the operation"""
        if not self.tensorflow_available:
            raise RuntimeError(f"Cannot perform {operation_name}: TensorFlow not available. "
                             "This may be due to missing Visual C++ redistributables on Windows. "
                             "Please install TensorFlow properly or use the API without ML features.")
    
    def smart_preprocess_image(self, image_bytes: bytes, model_name: str):
        """Smart image preprocessing that adapts to each model's requirements"""
        self._check_tensorflow_available("image preprocessing")
        
        if model_name not in self.model_configs:
            raise ValueError(f"Unknown model: {model_name}")
        
        target_size = self.model_configs[model_name]['input_size']
        
        try:
            # Load image
            image = Image.open(io.BytesIO(image_bytes))
            logger.info(f"Original image size: {image.size}, format: {image.format}")
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
                logger.info(f"Converted image to RGB mode")
            
            # Smart resize with aspect ratio preservation and padding if needed
            original_width, original_height = image.size
            target_width, target_height = target_size
            
            # Calculate scaling factor to fit within target size while preserving aspect ratio
            scale_w = target_width / original_width
            scale_h = target_height / original_height
            scale = min(scale_w, scale_h)
            
            # Resize with aspect ratio preserved
            new_width = int(original_width * scale)
            new_height = int(original_height * scale)
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Create a new image with target size and paste the resized image in the center
            final_image = Image.new('RGB', target_size, (0, 0, 0))  # Black background
            paste_x = (target_width - new_width) // 2
            paste_y = (target_height - new_height) // 2
            final_image.paste(image, (paste_x, paste_y))
            
            logger.info(f"Resized image to {target_size} for {model_name} model")
            
            # Convert to numpy array and normalize
            image_array = np.array(final_image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)
            
            logger.info(f"Final image array shape: {image_array.shape}")
            
            return image_array
        
        except Exception as e:
            logger.error(f"Error in smart preprocessing: {e}")
            raise
    
    def predict_damage(self, image_bytes: bytes):
        """Predict damage classification"""
        self._check_tensorflow_available("damage prediction")
        
        if 'classification' not in self.models:
            raise ValueError("Classification model not loaded")
        
        try:
            # Preprocess image with model-specific size
            processed_image = self.smart_preprocess_image(image_bytes, 'classification')
            
            # Make prediction
            prediction = self.models['classification'].predict(processed_image)[0]
            
            # Get class and confidence
            predicted_class_idx = np.argmax(prediction)
            confidence = float(np.max(prediction))
            predicted_class = self.class_names['damage_severity'][predicted_class_idx]
            
            return {
                'class': predicted_class,
                'confidence': confidence,
                'all_probabilities': {
                    class_name: float(prob) 
                    for class_name, prob in zip(
                        self.class_names['damage_severity'], 
                        prediction
                    )
                }
            }
        
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise
    
    def predict_location(self, image_bytes: bytes):
        """Predict damage location"""
        self._check_tensorflow_available("location prediction")
        
        if 'location' not in self.models:
            raise ValueError("Location model not loaded")
        
        try:
            # Preprocess image with model-specific size
            processed_image = self.smart_preprocess_image(image_bytes, 'location')
            
            # Make prediction
            prediction = self.models['location'].predict(processed_image)[0]
            
            # Get class and confidence
            predicted_class_idx = np.argmax(prediction)
            confidence = float(np.max(prediction))
            predicted_class = self.class_names['damage_location'][predicted_class_idx]
            
            return {
                'location': predicted_class,
                'confidence': confidence,
                'all_probabilities': {
                    class_name: float(prob) 
                    for class_name, prob in zip(
                        self.class_names['damage_location'], 
                        prediction
                    )
                }
            }
        
        except Exception as e:
            logger.error(f"Error during location prediction: {e}")
            raise
    
    def extract_features(self, image_bytes: bytes):
        """Extract features using feature extraction model"""
        self._check_tensorflow_available("feature extraction")
        
        if 'features' not in self.models:
            raise ValueError("Feature extraction model not loaded")
        
        try:
            # Preprocess image with model-specific size
            processed_image = self.smart_preprocess_image(image_bytes, 'features')
            
            # Extract features
            features = self.models['features'].predict(processed_image)[0]
            
            return {
                'features': features.tolist(),
                'feature_count': len(features)
            }
        
        except Exception as e:
            logger.error(f"Error during feature extraction: {e}")
            raise
    
    def comprehensive_analysis(self, image_bytes: bytes):
        """Perform comprehensive damage analysis using all models"""
        self._check_tensorflow_available("comprehensive analysis")
        
        results = {}
        
        try:
            # Damage classification
            if 'classification' in self.models:
                results['damage_classification'] = self.predict_damage(image_bytes)
            
            # Damage location
            if 'location' in self.models:
                results['damage_location'] = self.predict_location(image_bytes)
            
            # Feature extraction
            if 'features' in self.models:
                results['features'] = self.extract_features(image_bytes)
            
            # Calculate overall confidence score
            confidences = []
            if 'damage_classification' in results:
                confidences.append(results['damage_classification']['confidence'])
            if 'damage_location' in results:
                confidences.append(results['damage_location']['confidence'])
            
            if confidences:
                results['overall_confidence'] = float(np.mean(confidences))
            
            return results
        
        except Exception as e:
            logger.error(f"Error during comprehensive analysis: {e}")
            raise

# Initialize the model manager
model_manager = ModelManager() 