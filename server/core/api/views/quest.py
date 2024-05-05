from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.api.models import Quest
from core.api.serializers import QuestSerializer


class QuestView(APIView):

    serializer_class = QuestSerializer
    permission_classes = (AllowAny,)

    def get(self, request: Request, lat: float, lon: float) -> Response:
        quests = Quest.objects.all()
        serializer = QuestSerializer(quests, many=True)

        success = True
        status_code = status.HTTP_200_OK
        message = 'Submissions received successfully.'

        response = {
            'success': success,
            'status code': status_code,
            'message': message,
            'data': serializer.data
        }

        return Response(response, status=status_code)
