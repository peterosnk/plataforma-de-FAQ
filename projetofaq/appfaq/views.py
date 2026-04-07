from django.shortcuts import redirect, render, get_object_or_404
from .models import FAQ, HistoricoChat
from django.db import models
from django.db.models import Max
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .serializers import FAQSerializer
from django.conf import settings
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_KEY'))

@api_view(['POST'])
def chatbot_api(request):
    try:
        user_message = request.data.get('message')
        if not user_message:
            return Response({'error': 'Mensagem vazia'}, status=400)

        # Buscar todo o FAQ para dar contexto à IA
        faqs = FAQ.objects.filter(privado=False)
        context = "Você é um assistente de suporte especializado nesta plataforma de FAQ. "
        context += "Responda as dúvidas dos usuários de forma educada e baseada exclusivamente nas informações abaixo:\n\n"
        
        for faq in faqs:
            context += f"Pergunta: {faq.pergunta}\nResposta: {faq.solucao}\n\n"

        context += "\nSe a informação não estiver no FAQ acima, diga educadamente que não possui essa informação específica e sugira entrar em contato com o suporte humano."
 
        # Usar o modelo estável e disponível
        model = genai.GenerativeModel('gemini-flash-latest')
        prompt = f"Contexto:\n{context}\n\nPergunta do usuário: {user_message}"
        response = model.generate_content(prompt)

        bot_response = response.text

        # Salvar no Banco de Dados
        # Como é uma API pública, o usuário pode não estar logado
        user = request.user if request.user.is_authenticated else None
        
        HistoricoChat.objects.create(
            usuario=user,
            pergunta_usuario=user_message,
            resposta_ia=bot_response
        )

        return Response({'response': bot_response})

    except Exception as e:
        print(f"Erro no Chatbot Gemini: {str(e)}")
        return Response({'error': 'Erro ao processar sua dúvida com a IA'}, status=500)

@api_view(['POST'])
def login_api(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')
    
    # No Django, o User padrao usa 'username' para login
    # Mas o frontend esta enviando 'email'
    try:
        user_obj = User.objects.get(email=email)
        user = authenticate(username=user_obj.username, password=password)
        if user is not None:
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff
            })
        else:
            return Response({'error': 'Senha incorreta'}, status=401)
    except User.DoesNotExist:
        return Response({'error': 'Usuário não encontrado'}, status=404)

@api_view(['POST'])
def register_api(request):
    try:
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Nome de usuário já existe'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'E-mail já cadastrado'}, status=400)
            
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

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
    faqs = FAQ.objects.all().order_by('ordem') # Pegar todos para reordenar
    serializer = FAQSerializer(faqs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def user_api_list(request):
    users = User.objects.all().order_by('-id')[:10] # Aumentado para ver mais usuários
    data = []
    for user in users:
        data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff, # True se for Admin
            'date_joined': user.date_joined.strftime('%d/%m/%Y'),
            'last_login': user.last_login.strftime('%d/%m/%Y %H:%M') if user.last_login else 'Nunca'
        })
    return Response(data)

@api_view(['POST'])
def update_user_api(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        data = request.data
        
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        
        # O is_staff no Django define se é Administrador
        is_admin = data.get('role') == 'Administrador'
        user.is_staff = is_admin
        
        if data.get('password'):
            user.set_password(data.get('password'))
            
        user.save()
        return Response({'message': 'Usuário atualizado com sucesso!'})
    except User.DoesNotExist:
        return Response({'error': 'Usuário não encontrado'}, status=404)

@api_view(['POST'])
def create_faq_api(request):
    try:
        # Quando enviamos arquivos, usamos request.data (que lida com multipart)
        pergunta = request.data.get('pergunta')
        descricao = request.data.get('descricao', '')
        solucao = request.data.get('solucao')
        midia = request.FILES.get('midia')
        privado = request.data.get('privado') == 'true'
        
        # Pegar a maior ordem atual para colocar a nova pergunta no final
        max_order = FAQ.objects.aggregate(Max('ordem'))['ordem__max'] or 0
        
        FAQ.objects.create(
            pergunta=pergunta,
            descricao=descricao,
            solucao=solucao,
            ordem=max_order + 1,
            midia=midia,
            privado=privado
        )
        return Response({'message': 'FAQ criado com sucesso!'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def update_faq_api(request, faq_id):
    try:
        faq = FAQ.objects.get(id=faq_id)
        
        faq.pergunta = request.data.get('pergunta', faq.pergunta)
        faq.descricao = request.data.get('descricao', faq.descricao)
        faq.solucao = request.data.get('solucao', faq.solucao)
        
        if 'privado' in request.data:
            faq.privado = request.data.get('privado') == 'true'
        
        if 'midia' in request.FILES:
            faq.midia = request.FILES['midia']
        elif request.data.get('remover_midia') == 'true':
            faq.midia = None
            
        faq.save()
        return Response({'message': 'FAQ atualizado com sucesso!'})
    except FAQ.DoesNotExist:
        return Response({'error': 'FAQ não encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def create_user_api(request):
    try:
        data = request.data
        is_admin = data.get('role') == 'Administrador'
        
        user = User.objects.create_user(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password')
        )
        user.is_staff = is_admin
        user.save()
        
        return Response({'message': 'Usuário criado com sucesso!'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
def delete_user_api(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'Usuário excluído com sucesso!'})
    except User.DoesNotExist:
        return Response({'error': 'Usuário não encontrado'}, status=404)

@api_view(['DELETE'])
def delete_faq_api(request, faq_id):
    try:
        faq = FAQ.objects.get(id=faq_id)
        faq.delete()
        return Response({'message': 'Pergunta excluída com sucesso!'})
    except FAQ.DoesNotExist:
        return Response({'error': 'Pergunta não encontrada'}, status=404)

@api_view(['GET'])
def faq_api_list_all(request):
    faqs = FAQ.objects.filter(privado=False).order_by('ordem') # Somente as públicas
    serializer = FAQSerializer(faqs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def reorder_faqs_api(request):
    try:
        faqs_data = request.data.get('faqs', [])
        for item in faqs_data:
            faq_id = item.get('id')
            new_order = item.get('ordem')
            FAQ.objects.filter(id=faq_id).update(ordem=new_order)
        return Response({'message': 'Ordem atualizada com sucesso!'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

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