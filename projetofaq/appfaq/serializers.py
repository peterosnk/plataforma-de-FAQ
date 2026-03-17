from rest_framework import serializers
from .models import FAQ
from django.contrib.auth.models import User
import re


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']

    def validate(self, data):
        password = data['password1']

        if len(data['password1']) < 6:
            raise serializers.ValidationError("A senha deve conter pelo menos 6 caracteres.")
        
        if not re.search(r'[A-Za-z]', password):
            raise serializers.ValidationError("A senha deve conter pelo menos uma letra.")

        if not re.search(r'[0-9]', password):
            raise serializers.ValidationError("A senha deve conter pelo menos um número.")

        if data['password1'] != data['password2']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return data
    
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )