#!/usr/bin/env python3
"""
Test script to verify Hugging Face integration
"""

import os
from dotenv import load_dotenv
from transformers import pipeline, AutoTokenizer

# Load environment variables
load_dotenv()

def test_huggingface_setup():
    """Test Hugging Face setup and token"""
    print("🧪 Testing Hugging Face Integration...")
    
    # Check if token is available
    hf_token = os.getenv('HUGGINGFACE_TOKEN')
    if not hf_token:
        print("❌ HUGGINGFACE_TOKEN not found in environment")
        return False
    
    print(f"✅ Token found: {hf_token[:10]}...")
    
    try:
        # Test with a lightweight model for quick verification
        print("📥 Loading model (this may take a moment)...")
        
        # Use a smaller, faster model for testing
        model_name = "microsoft/DialoGPT-small"  # Smaller model for faster loading
        
        tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token)
        
        # Add pad token if it doesn't exist
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        generator = pipeline(
            "text-generation",
            model=model_name,
            tokenizer=tokenizer,
            token=hf_token,
            max_length=100,
            temperature=0.7,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
        
        print("✅ Model loaded successfully!")
        
        # Test a simple financial query
        test_prompt = """You are a helpful financial advisor. 
        
        User question: How can I save money on groceries?
        
        Response:"""
        
        print("🤖 Testing response generation...")
        response = generator(
            test_prompt,
            max_length=len(test_prompt.split()) + 50,
            num_return_sequences=1,
            temperature=0.7,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
        
        generated_text = response[0]['generated_text']
        if "Response:" in generated_text:
            response_text = generated_text.split("Response:")[-1].strip()
        else:
            response_text = generated_text[len(test_prompt):].strip()
        
        response_text = response_text.replace("<|endoftext|>", "").strip()
        
        print("✅ Response generated successfully!")
        print(f"📝 Sample response: {response_text[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during model loading/testing: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_huggingface_setup()
    if success:
        print("\n🎉 Hugging Face integration is working correctly!")
        print("You can now run the main chatbot with Hugging Face as the primary AI service.")
    else:
        print("\n⚠️ Hugging Face integration needs attention.")
        print("Please check your HUGGINGFACE_TOKEN and internet connection.")
