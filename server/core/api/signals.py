from django.core.signals import request_started
from django.dispatch import receiver


@receiver(request_started)
def load_trophies_activation(sender, **kwargs):
    from core.api.models import Trophy

    for trophy in Trophy.objects.all():
        exec(trophy.activation.replace("trophy_title", trophy.title))
