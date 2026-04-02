from django.db import models

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
