from django.contrib import admin
from .models import FAQ, HistoricoChat

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('pergunta', 'ordem', 'privado')
    list_editable = ('ordem', 'privado')
    search_fields = ('pergunta', 'descricao')

@admin.register(HistoricoChat)
class HistoricoChatAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'pergunta_usuario', 'data_criacao')
    list_filter = ('data_criacao', 'usuario')
    search_fields = ('pergunta_usuario', 'resposta_ia')
    readonly_fields = ('data_criacao',)
