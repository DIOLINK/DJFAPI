from django.contrib import admin
from .models import Reserva, CarrouselItem, LegalText

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ("id", "paciente", "fecha_hora", "estado", "creado")
    list_filter = ("estado", "fecha_hora")
    search_fields = ("paciente__username", "nota")
    actions = ["confirmar_reservas", "cancelar_reservas"]

    def confirmar_reservas(self, request, queryset):
        updated = queryset.update(estado='confirmada')
        self.message_user(request, f"{updated} reservas confirmadas.")

    def cancelar_reservas(self, request, queryset):
        updated = queryset.update(estado='cancelada')
        self.message_user(request, f"{updated} reservas canceladas.")

@admin.register(CarrouselItem)
class CarrouselItemAdmin(admin.ModelAdmin):
    list_display = ("id", "orden", "texto", "activo", "creado")
    list_editable = ("orden", "activo")
    search_fields = ("texto",)

@admin.register(LegalText)
class LegalTextAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "visible", "creado")
    list_editable = ("visible",)
    search_fields = ("titulo",)
