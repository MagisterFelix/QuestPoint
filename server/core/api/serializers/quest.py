from rest_framework.exceptions import ValidationError
from rest_framework.serializers import CharField, ModelSerializer

from core.api.models import Quest
from core.api.models.category import Category
from core.api.models.user import User


class QuestSerializer(ModelSerializer):

    category = CharField(source="category.title")
    creator = CharField(source="creator.username", required=False)

    class Meta:

        model = Quest
        fields = ("id", "title", "description", "category", "reward",
                  "latitude", "longitude", "creator", "created_at")

    def validate(self, attrs: dict) -> dict:
        reward = attrs.get("reward")
        category = attrs.get("category")
        creator = self.context.get("sender")

        if category is not None and category.get("title"):
            if not Category.objects.filter(title=category["title"]).exists():
                raise ValidationError("Title doesn't exists")
        if creator is not None:
            attrs["creator"] = creator
            if not User.objects.filter(username=creator.username).exists():
                raise ValidationError("User doesn't exists")

            if reward is not None:
                if reward == 0:
                    raise ValidationError("Reward cannot be the zero.")
                if reward > creator.balance:
                    raise ValidationError("Balance cannot be lower than reward.")

        return super().validate(attrs)

    def create(self, validated_data):
        user = validated_data["creator"]
        user.balance -= validated_data["reward"]
        user.save()
        validated_data["creator"] = user
        validated_data["category"] = Category.objects.get(title=validated_data["category"]["title"])
        return super().create(validated_data)
