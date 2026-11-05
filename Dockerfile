# Usa a imagem oficial do Python, versão slim para ser mais leve
FROM python:3.11-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Impede a criação de arquivos .pyc e permite que os logs apareçam imediatamente no console
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copia o arquivo de dependências primeiro (aproveita o cache do Docker)
COPY requirements.txt .

# Instala as dependências do projeto
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código do projeto para o contêiner
COPY . .

# Comando padrão ao iniciar o contêiner (pode ser ajustado conforme a entrada do seu app)
CMD ["python", "main.py"]