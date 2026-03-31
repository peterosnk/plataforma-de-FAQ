from django.shortcuts import redirect, render, get_object_or_404
from .models import FAQ
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .serializers import FAQSerializer

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
    faqs = FAQ.objects.all().order_by('-id')[:5] # Pegar as 5 últimas
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
        data = request.data
        FAQ.objects.create(
            pergunta=data.get('pergunta'),
            descricao=data.get('descricao', ''),
            solucao=data.get('solucao')
        )
        return Response({'message': 'FAQ criado com sucesso!'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def update_faq_api(request, faq_id):
    try:
        faq = FAQ.objects.get(id=faq_id)
        data = request.data
        faq.pergunta = data.get('pergunta', faq.pergunta)
        faq.descricao = data.get('descricao', faq.descricao)
        faq.solucao = data.get('solucao', faq.solucao)
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
    faqs = FAQ.objects.all().order_by('pergunta') # Ordenar por pergunta
    serializer = FAQSerializer(faqs, many=True)
    return Response(serializer.data)

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