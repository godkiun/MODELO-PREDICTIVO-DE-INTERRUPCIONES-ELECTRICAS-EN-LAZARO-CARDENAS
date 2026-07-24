import os
from flask import Blueprint, jsonify, request, render_template_string
from infrastructure.persistence.reportes_repository_impl import ReportesRepositoryImpl
from core.usecases.reportar_apagon_usecase import ReportarApagonUseCase

reportes_bp = Blueprint('reportes', __name__)
repo = ReportesRepositoryImpl()

@reportes_bp.route('/api/reportar_apagon', methods=['POST'])
def reportar_apagon():
    try:
        datos_reporte = request.json
        if not datos_reporte:
            return jsonify({"estatus": "error", "mensaje": "Datos no proporcionados."}), 400

        colonia = datos_reporte.get('colonia')
        fecha = datos_reporte.get('fecha')
        hora = datos_reporte.get('hora')

        usecase = ReportarApagonUseCase(repo)
        exito = usecase.execute(colonia, fecha, hora)

        if exito:
            return jsonify({
                "estatus": "exito",
                "mensaje": "Reporte enviado para validación. ¡Gracias por tu aporte!"
            }), 201
        else:
            return jsonify({"estatus": "error", "mensaje": "Error guardando el reporte en base de datos."}), 500
    except ValueError as ve:
        return jsonify({"estatus": "error", "mensaje": str(ve)}), 400
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": f"Error interno del servidor: {str(e)}"}), 500


@reportes_bp.route('/api/admin-reportes', methods=['GET'])
def admin_reportes():
    token = request.args.get('token')
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')
    
    if not token or token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403

    try:
        reportes_obj = repo.obtener_pendientes()
        reportes = [
            (r.id, r.colonia, r.fecha, r.hora, r.fecha_creacion)
            for r in reportes_obj
        ]

        html_template = '''
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dashboard de Administración - Reportes</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-900 text-gray-100 min-h-screen p-6 md:p-10">
            <div class="max-w-6xl mx-auto space-y-8">
                <header class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-800 pb-6 gap-4">
                    <div>
                        <h1 class="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-350 to-emerald-400">
                            Dashboard de Administración - Reportes
                        </h1>
                        <p class="text-gray-400 mt-1 text-sm font-medium">
                            Validación y moderación de reportes de apagones (Human-in-the-Loop)
                        </p>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-400">
                        <span class="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                        <span>Token Activo</span>
                    </div>
                </header>

                <div>
                    <h2 class="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                        ⚡ Reportes Pendientes de Validación
                    </h2>

                    {% if reportes %}
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {% for rep in reportes %}
                        <div class="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex flex-col justify-between space-y-4">
                            <div class="space-y-3">
                                <div class="flex justify-between items-start border-b border-gray-700 pb-2">
                                    <span class="text-teal-400 text-xs font-bold uppercase">
                                        ID: #{{ rep[0] }}
                                    </span>
                                    <span class="text-[10px] text-gray-400 font-mono">
                                        {{ rep[4] }}
                                    </span>
                                </div>
                                
                                <div>
                                    <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Colonia</label>
                                    <p class="text-lg font-bold text-gray-100 uppercase tracking-tight">{{ rep[1] }}</p>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Fecha</label>
                                        <p class="text-sm font-semibold text-gray-300">{{ rep[2] }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Hora</label>
                                        <p class="text-sm font-semibold text-gray-300">{{ rep[3] }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-3 border-t border-gray-700">
                                <a href="/api/aprobar-reporte?id={{ rep[0] }}&token={{ token }}" class="w-full inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm text-center">
                                    Aprobar
                                </a>
                            </div>
                        </div>
                        {% endfor %}
                    </div>
                    {% else %}
                    <div class="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center max-w-lg mx-auto shadow-md">
                        <span class="text-4xl">🎉</span>
                        <h3 class="text-lg font-bold text-gray-200 mt-4">Todo al día</h3>
                        <p class="text-gray-400 text-sm mt-1">No hay reportes de usuarios pendientes de validar.</p>
                    </div>
                    {% endif %}
                </div>
            </div>
        </body>
        </html>
        '''
        return render_template_string(html_template, reportes=reportes, token=token)
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500


@reportes_bp.route('/api/aprobar-reporte', methods=['GET'])
def aprobar_reporte():
    token = request.args.get('token')
    TOKEN_SECRETO = os.getenv('TOKEN_CRON')
    
    if not token or token != TOKEN_SECRETO:
        return jsonify({"estatus": "error", "mensaje": "Acceso denegado"}), 403

    reporte_id = request.args.get('id')
    if not reporte_id:
        return jsonify({"estatus": "error", "mensaje": "Falta el ID del reporte."}), 400

    try:
        exito = repo.aprobar_reporte(int(reporte_id))
        if not exito:
            return jsonify({"estatus": "error", "mensaje": "Reporte no encontrado."}), 404

        html_template = '''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reporte Aprobado</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: #f1f5f9; padding: 2rem; text-align: center; }
                h1 { color: #10b981; }
                p { color: #94a3b8; font-size: 1.1rem; }
                a { color: #2dd4bf; text-decoration: none; font-weight: bold; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>¡Reporte aprobado con éxito!</h1>
            <p>El reporte con ID {{ reporte_id }} ha sido aprobado correctamente.</p>
            <p><a href="/api/admin-reportes?token={{ token }}">Volver a la lista de pendientes</a></p>
        </body>
        </html>
        '''
        return render_template_string(html_template, reporte_id=reporte_id, token=token)
    except Exception as e:
        return jsonify({"estatus": "error", "mensaje": str(e)}), 500
