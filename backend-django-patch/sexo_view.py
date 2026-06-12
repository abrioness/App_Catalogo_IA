"""
Vista para exponer el catálogo de sexo en Django.

1. Copia o adapta según tu models.py (nombre del modelo, p. ej. TblCatSexo).
2. En urls.py del proyecto api_Catalogo_IA:

    from .sexo_view import SexoListView

    urlpatterns = [
        ...
        path("api/Sexo/", SexoListView.as_view()),
    ]
"""

from django.http import JsonResponse
from django.views import View


class SexoListView(View):
    """GET → [{ "IdSexo": 1, "Sexo": "Femenino", "Activo": true }, ...]"""

    def get(self, request):
        try:
            from catalogo.models import TblCatSexo  # type: ignore
        except ImportError:
            try:
                from api.models import TblCatSexo  # type: ignore
            except ImportError:
                try:
                    from catalogo.models import Sexo  # type: ignore
                except ImportError:
                    try:
                        from api.models import Sexo  # type: ignore
                    except ImportError as e:
                        return JsonResponse(
                            {
                                "error": "Ajusta el import del modelo Sexo/TblCatSexo.",
                                "detail": str(e),
                            },
                            status=500,
                        )

        Modelo = TblCatSexo if "TblCatSexo" in dir() else Sexo  # type: ignore[name-defined]

        filas = Modelo.objects.filter(Activo=True).values(  # type: ignore[attr-defined]
            "IdSexo", "Sexo", "Activo"
        )
        return JsonResponse(list(filas), safe=False)
