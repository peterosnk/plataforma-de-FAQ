from django.db import models
from django.contrib.auth.models import User

class FAQ(models.Model):
    pergunta = models.CharField(max_length=200)
    descricao = models.TextField()
    solucao = models.TextField()
    ordem = models.PositiveIntegerField(default=0)
    midia = models.FileField(upload_to='faq_midia/', null=True, blank=True)
    privado = models.BooleanField(default=False)

    class Meta:
        ordering = ['ordem']

    def __str__(self):
        return self.pergunta

class HistoricoChat(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    pergunta_usuario = models.TextField()
    resposta_ia = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data_criacao']

    def __str__(self):
        user_str = self.usuario.username if self.usuario else "Anônimo"
        return f"{user_str} - {self.data_criacao.strftime('%d/%m/%Y %H:%M')}"
