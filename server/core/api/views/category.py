from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.api.models import Category
from core.api.serializers import CategorySerializer


class CategoryView(APIView):

    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)

    def get(self, request: Request) -> Response:
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)

        success = True
        status_code = status.HTTP_200_OK
        message = "Categories received successfully."

        response = {
            "success": success,
            "status code": status_code,
            "message": message,
            "data": serializer.data
        }

        return Response(response, status=status_code)
