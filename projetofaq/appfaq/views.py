from django.shortcuts import redirect, render, get_object_or_404
from .models import FAQ
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import FAQSerializer

@api_view(['GET'])
def dashboard_stats(request):
    total_faqs = FAQ.objects.count()
    total_users = User.objects.count()
    
    # Dados fictícios para o gráfico (simulando 7 dias)
    # Em um sistema real, você buscaria isso por data de criação
    chart_data = [45, 72, 58, 89, 95, 62, 38] 
    
    return Response({
        'total_faqs': total_faqs,
        'total_users': total_users,
        'logins_month': 8945, # Valor estático por enquanto
        'satisfaction': 4.8,  # Valor estático por enquanto
        'chart_data': chart_data
    })

@api_view(['GET'])
def faq_api_list(request):
    faqs = FAQ.objects.all().order_by('-id')[:5] # Pegar as 5 últimas
    serializer = FAQSerializer(faqs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def user_api_list(request):
    users = User.objects.all().order_by('-id')[:5]
    data = []
    for user in users:
        data.append({
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined.strftime('%d/%m/%Y'),
            'last_login': user.last_login.strftime('%d/%m/%Y %H:%M') if user.last_login else 'Nunca'
        })
    return Response(data)

# Listar e criar os FAQs (Existente)
def faq_list(request):
    if request.method == 'GET':
        faqs = FAQ.objects.all()
        return render(request, 'faq_list.html', {'faqs': faqs})

    elif request.method == 'POST':
        pergunta = (request.POST.get('pergunta'))
        descricao = (request.POST.get('descricao'))
        solucao = (request.POST.get('solucao'))

        FAQ.objects.create(
            pergunta=pergunta,
            descricao=descricao,
            solucao=solucao,
        )

        return redirect('faq_list')

# Excluir o FAQ
def faq_delete(request, faq_id):
    faq = get_object_or_404(FAQ, id=faq_id)
    faq.delete()
    return redirect('faq_list')

# Editar o FAQ
def faq_edit(request, faq_id):
    faq = get_object_or_404(FAQ, id=faq_id)
    if request.method == 'POST':
        faq.pergunta = request.POST.get('pergunta')
        faq.descricao = request.POST.get('descricao')
        faq.solucao = request.POST.get('solucao')
        faq.save()

        return redirect('faq_list')
    
    return render(request, 'faq_edit.html', {'faq': faq})