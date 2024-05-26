from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from core.api.models import User
from core.api.utils import AuthorizationUtils


class UpdaterConsumer(AsyncJsonWebsocketConsumer):

    _group = None

    async def connect(self) -> None:
        if self.channel_layer is None:
            return None

        token = self.scope["cookies"].get("access_token")

        if token is None:
            await self.close(code=403)
            return None

        user_id = AuthorizationUtils.get_user_id(token=token)

        if user_id is None:
            await self.close(code=403)
            return None

        self.user = await sync_to_async(User.objects.get_or_none)(pk=user_id)

        if self.user is None or not self.user.is_active:
            await self.close(code=403)
            return None

        self._group = f"updater-{user_id}"

        await self.channel_layer.group_add(self._group, self.channel_name)

        await self.accept()

    async def update(self, event: dict) -> None:
        await self.send_json(content=event)

    async def disconnect(self, _) -> None:
        if self.channel_layer is None:
            return None

        if self._group is None:
            return None

        await self.channel_layer.group_discard(self._group, self.channel_name)
