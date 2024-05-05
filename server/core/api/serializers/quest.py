from rest_framework.serializers import CharField, ModelSerializer

from core.api.models import Quest


class QuestSerializer(ModelSerializer):

    category = CharField(source='category.title')
    creator = CharField(source='creator.username')

    class Meta:

        model = Quest
        fields = ('id', 'title', 'description', 'category', 'reward',
                  'latitude', 'longitude', 'creator', 'created_at')
