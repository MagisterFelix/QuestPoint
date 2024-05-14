from rest_framework.serializers import ModelSerializer

from core.api.models import Category


class DeprecatedCategorySerializer(ModelSerializer):

    class Meta:

        model = Category
        fields = ("id", "title", "image")
