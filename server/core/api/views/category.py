from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Category
from core.api.serializers import CategorySerializer


class CategoryListView(ListAPIView):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticated,)
