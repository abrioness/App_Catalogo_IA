"""
Copia este archivo en tu proyecto Django (api_Catalogo_IA) y registra la ruta
en urls.py para que la app móvil pueda leer la tabla intermedia herramienta–compatibilidad.

Ejemplo en urls.py (router o path):

    path("api/HerramientaCompatibilidad/", HerramientaCompatibilidadListView.as_view()),

Ajusta el nombre del modelo según tu models.py (p. ej. TblHerramientaCompatibilidad).
"""

from django.http import JsonResponse
from django.views import View


class HerramientaCompatibilidadListView(View):
    """GET → [{ "IdHerramienta": 1, "IdCompatibilidad": 2 }, ...]"""

    def get(self, request):
        try:
            from catalogo.models import TblHerramientaCompatibilidad  # type: ignore
        except ImportError:
            try:
                from api.models import TblHerramientaCompatibilidad  # type: ignore
            except ImportError as e:
                return JsonResponse(
                    {
                        "error": "Ajusta el import del modelo TblHerramientaCompatibilidad.",
                        "detail": str(e),
                    },
                    status=500,
                )

        filas = TblHerramientaCompatibilidad.objects.all().values(
            "IdHerramienta", "IdCompatibilidad"
        )
        return JsonResponse(list(filas), safe=False)
