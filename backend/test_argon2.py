try:
    import argon2
    print(f"Argon2 version: {argon2.__version__}")
    from passlib.hash import argon2 as argon2_hash
    print("Passlib argon2 handler loaded")
    h = argon2_hash.hash("password123")
    print(f"Hash generated: {h}")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Error: {e}")
