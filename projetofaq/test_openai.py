import os
from dotenv import load_dotenv
from openai import OpenAI

# Caminho absoluto para o .env
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

api_key = os.getenv('OPENAI_API_KEY')
print(f"Chave encontrada: {bool(api_key)}")
if api_key:
    print(f"Inicio da chave: {api_key[:10]}...")

client = OpenAI(api_key=api_key)

try:
    print("Testando conexão com OpenAI...")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Oi"}],
        max_tokens=5
    )
    print("Sucesso!")
    print(f"Resposta: {response.choices[0].message.content}")
except Exception as e:
    print(f"ERRO DETALHADO: {type(e).__name__}: {str(e)}")
