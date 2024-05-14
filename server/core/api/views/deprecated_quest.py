from django.db.models.expressions import RawSQL
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.api.models import Quest
from core.api.serializers import DeprecatedQuestSerializer


class DeprecatedQuestView(APIView):

    serializer_class = DeprecatedQuestSerializer
    permission_classes = (AllowAny,)

    def get(self, request: Request, lat: float, lon: float) -> Response:
        if not ((-90 <= float(lat) <= 90) and (-180 <= float(lon) <= 180)):
            success = False
            status_code = status.HTTP_400_BAD_REQUEST
            message = "Invalid coordinates"
            response = {
                "success": success,
                "status code": status_code,
                "message": message,
                "data": []
            }
        else:
            quests = Quest.objects.annotate(distance=RawSQL(
                "6371 * acos(cos(radians(%s)) * cos(radians(latitude)) * cos(radians(longitude)\
                  - radians(%s)) + sin(radians(%s)) * sin(radians(latitude)))",
                [lat, lon, lat]
            )).filter(distance__lte=5)
            serializer = DeprecatedQuestSerializer(quests, many=True)

            success = True
            status_code = status.HTTP_200_OK
            message = "Submissions received successfully."

            response = {
                "success": success,
                "status code": status_code,
                "message": message,
                "data": serializer.data
            }

        return Response(response, status=status_code)

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data, context={"sender": self.request.user})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = Response(status=status.HTTP_200_OK)
        return response
