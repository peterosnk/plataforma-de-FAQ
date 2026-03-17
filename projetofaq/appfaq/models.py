from django.contrib.auth.models import User
from django.db import models

class FAQ(models.Model):
    pergunta = models.CharField(max_length=200)
    descricao = models.TextField()
    solucao = models.TextField()

    def __str__(self):
        return self.pergunta

class Usuario(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()
    primeiro_nome = models.CharField(max_length=100)
    ultimo_nome = models.CharField(max_length=100)
    senha = models.CharField(max_length=100)