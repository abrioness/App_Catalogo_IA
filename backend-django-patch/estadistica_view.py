# """
# Vista para listar y registrar estadísticas de uso (onboarding).

# 1. Copia o adapta según tu models.py (nombre del modelo, p. ej. TblEstadistica).
# 2. En urls.py del proyecto api_Catalogo_IA, reemplaza la ruta GET-only por:

#     from .estadistica_view import EstadisticaView

#     urlpatterns = [
#         ...
#         path("api/Estadistica/", EstadisticaView.as_view()),
#     ]
# """

# import json
# from datetime import date

# from django.http import JsonResponse
# from django.views import View


# def _resolver_modelo():
#     for mod, name in (
#         ("catalogo.models", "TblEstadistica"),
#         ("api.models", "TblEstadistica"),
#         ("catalogo.models", "Estadistica"),
#         ("api.models", "Estadistica"),
#     ):
#         try:
#             module = __import__(mod, fromlist=[name])
#             return getattr(module, name)
#         except (ImportError, AttributeError):
#             continue
#     return None


# def _campo(body: dict, *keys, default=None):
#     for key in keys:
#         if key in body and body[key] is not None and body[key] != "":
#             return body[key]
#     return default


# def _fila_a_json(obj) -> dict:
#     return {
#         "IdEstadistica": getattr(obj, "IdEstadistica", getattr(obj, "pk", None)),
#         "TipoDispositivo": getattr(obj, "TipoDispositivo", None),
#         "IdNivelEducativo": getattr(obj, "IdNivelEducativo_id", getattr(obj, "IdNivelEducativo", None)),
#         "IdEtario": getattr(obj, "IdEtario_id", getattr(obj, "IdEtario", None)),
#         "IdSexo": getattr(obj, "IdSexo_id", getattr(obj, "IdSexo", None)),
#         "IdZona": getattr(obj, "IdZona_id", getattr(obj, "IdZona", None)),
#         "Munpol": getattr(obj, "Munpol_id", getattr(obj, "Munpol", None)),
#         "Activo": getattr(obj, "Activo", True),
#         "UsuarioRegistro": getattr(obj, "UsuarioRegistro", None),
#         "FechaRegistro": str(getattr(obj, "FechaRegistro", "")),
#     }


# class EstadisticaView(View):
#     """GET → listado; POST → alta de estadística de onboarding."""

#     def get(self, request):
#         Modelo = _resolver_modelo()
#         if Modelo is None:
#             return JsonResponse(
#                 {
#                     "error": "Ajusta el import del modelo TblEstadistica/Estadistica.",
#                 },
#                 status=500,
#             )

#         filas = Modelo.objects.all().order_by("-IdEstadistica")
#         return JsonResponse([_fila_a_json(f) for f in filas], safe=False)

#     def post(self, request):
#         Modelo = _resolver_modelo()
#         if Modelo is None:
#             return JsonResponse(
#                 {
#                     "error": "Ajusta el import del modelo TblEstadistica/Estadistica.",
#                 },
#                 status=500,
#             )

#         try:
#             body = json.loads(request.body.decode("utf-8") or "{}")
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "JSON inválido."}, status=400)

#         if not isinstance(body, dict):
#             return JsonResponse({"error": "Se esperaba un objeto JSON."}, status=400)

#         datos = {
#             "TipoDispositivo": _campo(
#                 body, "TipoDispositivo", "tipodispositivo", "tipoDispositivo"
#             ),
#             "IdNivelEducativo_id": _campo(
#                 body, "IdNivelEducativo", "idNivelEducativo", "idsNivelEducativo"
#             ),
#             "IdEtario_id": _campo(body, "IdEtario", "idEtario", "idsEtario"),
#             "IdSexo_id": _campo(body, "IdSexo", "idSexo", "idsSexo"),
#             "IdZona_id": _campo(body, "IdZona", "idZona", "idsZona"),
#             "Munpol_id": _campo(body, "Munpol", "munpol", "IdMunpol", "idsMunpol"),
#             "Activo": _campo(body, "Activo", "activo", default=True),
#             "UsuarioRegistro": _campo(
#                 body, "UsuarioRegistro", "usuarioRegistro", default=1
#             ),
#             "FechaRegistro": _campo(
#                 body, "FechaRegistro", "fechaRegistro", default=date.today()
#             ),
#         }

#         fks = (
#             "IdNivelEducativo_id",
#             "IdEtario_id",
#             "IdSexo_id",
#             "IdZona_id",
#             "Munpol_id",
#         )
#         if datos["TipoDispositivo"] is None or any(datos[k] is None for k in fks):
#             return JsonResponse(
#                 {
#                     "error": "Faltan campos obligatorios.",
#                     "requeridos": [
#                         "TipoDispositivo",
#                         "IdNivelEducativo",
#                         "IdEtario",
#                         "IdSexo",
#                         "IdZona",
#                         "Munpol",
#                     ],
#                 },
#                 status=400,
#             )

#         try:
#             creada = Modelo.objects.create(**datos)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#         return JsonResponse(_fila_a_json(creada), status=201)
