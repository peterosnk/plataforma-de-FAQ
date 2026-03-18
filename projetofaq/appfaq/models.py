from django.contrib.auth.models import User
from django.db import models

class FAQ(models.Model):
    pergunta = models.CharField(max_length=200)
    descricao = models.TextField()
    solucao = models.TextField()

    def __str__(self):
        return self.pergunta
