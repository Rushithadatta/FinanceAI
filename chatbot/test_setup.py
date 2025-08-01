#!/usr/bin/env python3
"""
Test script to verify the chatbot dependencies are installed correctly
"""

def test_imports():
    """Test if all required packages can be imported"""
    print("🧪 Testing package imports...")
    
    try:
        import streamlit
        print("✅ Streamlit imported successfully")
    except ImportError as e:
        print(f"❌ Streamlit import failed: {e}")
        return False
    
    try:
        import pandas
        print("✅ Pandas imported successfully")
    except ImportError as e:
        print(f"❌ Pandas import failed: {e}")
        return False
    
    try:
        import numpy
        print("✅ Numpy imported successfully")
    except ImportError as e:
        print(f"❌ Numpy import failed: {e}")
        return False
    
    try:
        import plotly
        print("✅ Plotly imported successfully")
    except ImportError as e:
        print(f"❌ Plotly import failed: {e}")
        return False
    
    try:
        import requests
        print("✅ Requests imported successfully")
    except ImportError as e:
        print(f"❌ Requests import failed: {e}")
        return False
    
    try:
        from dotenv import load_dotenv
        print("✅ Python-dotenv imported successfully")
    except ImportError as e:
        print(f"❌ Python-dotenv import failed: {e}")
        return False
    
    try:
        import transformers
        print("✅ Transformers imported successfully")
    except ImportError as e:
        print(f"❌ Transformers import failed: {e}")
        return False
    
    try:
        from huggingface_hub import HfApi
        print("✅ HuggingFace Hub imported successfully")
    except ImportError as e:
        print(f"❌ HuggingFace Hub import failed: {e}")
        return False
    
    try:
        from ibm_watsonx_ai.foundation_models import Model
        print("✅ IBM Watson AI imported successfully")
    except ImportError as e:
        print(f"❌ IBM Watson AI import failed: {e}")
        return False
    
    try:
        import ibm_watson
        print("✅ IBM Watson imported successfully")
    except ImportError as e:
        print(f"❌ IBM Watson import failed: {e}")
        return False
    
    return True

def test_versions():
    """Display versions of key packages"""
    print("\n📦 Package versions:")
    
    try:
        import streamlit
        print(f"  Streamlit: {streamlit.__version__}")
    except: pass
    
    try:
        import pandas
        print(f"  Pandas: {pandas.__version__}")
    except: pass
    
    try:
        import numpy
        print(f"  Numpy: {numpy.__version__}")
    except: pass
    
    try:
        import transformers
        print(f"  Transformers: {transformers.__version__}")
    except: pass
    
    try:
        import torch
        print(f"  PyTorch: {torch.__version__}")
    except: pass

def test_environment():
    """Test environment configuration"""
    print("\n🔧 Environment test:")
    
    # Test .env file loading
    try:
        from dotenv import load_dotenv
        import os
        
        load_dotenv()
        
        # Check if .env variables are loaded (even if empty)
        env_vars = [
            'HUGGINGFACE_TOKEN',
            'IBM_WATSONX_API_KEY',
            'IBM_WATSONX_PROJECT_ID',
            'BACKEND_API_URL'
        ]
        
        for var in env_vars:
            value = os.getenv(var, 'NOT_SET')
            if 'your_' in value or value == 'NOT_SET':
                print(f"  ⚠️  {var}: Not configured (using placeholder)")
            else:
                print(f"  ✅ {var}: Configured")
        
    except Exception as e:
        print(f"  ❌ Environment test failed: {e}")

if __name__ == "__main__":
    print("🚀 AI Chatbot Dependency Test")
    print("=" * 50)
    
    success = test_imports()
    test_versions()
    test_environment()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests passed! Your environment is ready for the AI chatbot.")
        print("\n📋 Next steps:")
        print("1. Update your .env file with actual API tokens")
        print("2. Start your expense tracker backend (port 5000)")
        print("3. Run: conda run --live-stream --name expense-chatbot streamlit run app.py")
    else:
        print("❌ Some tests failed. Please check the error messages above.")
