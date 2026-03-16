from django.shortcuts import redirect, render, get_object_or_404
from .models import FAQ
from rest_framework import viewsets
from .serializers import FAQSerializer

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