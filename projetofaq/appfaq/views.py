from django.shortcuts import redirect, render, get_object_or_404
from .models import FAQ
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FAQSerializer, UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

#PARTE DO CADASTRO E LOGIN

#registro de usuario
class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuário cadastrado."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#login de usuario
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            return Response({"message": "Login bem-sucedido."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

# endpoints para a api
class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

#PARTE DO FAQ

# Listar e criar os FAQs
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