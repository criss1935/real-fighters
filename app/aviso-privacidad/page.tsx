import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Real Fighters México",
  description:
    "Aviso de privacidad de Real Fighters México conforme a la LFPDPPP: datos que recabamos, finalidades, derechos ARCO y eliminación de datos.",
};

export default function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <p className="text-red-600 font-semibold uppercase tracking-wide text-sm mb-2">
          Real Fighters México
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Aviso de Privacidad
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Última actualización: septiembre 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Responsable del tratamiento
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En cumplimiento de la Ley Federal de Protección de Datos
              Personales en Posesión de los Particulares (LFPDPPP),{" "}
              <strong>Grupo Deportivo Origin, S.A. de C.V.</strong> (&quot;Real
              Fighters México&quot;), con domicilio en Paseo de los Duraznos
              122, Paseos de Taxqueña, Coyoacán, Ciudad de México, C.P. 04250,
              es responsable del tratamiento de tus datos personales conforme
              a este aviso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Datos que recopilamos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Recabamos los datos que tú mismo nos proporcionas al
              inscribirte, agendar una clase o escribirnos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>
                Nombre completo y datos de contacto (teléfono, correo
                electrónico).
              </li>
              <li>
                Contenido de tus mensajes cuando nos escribes por WhatsApp,
                Messenger o Instagram, incluyendo las conversaciones con
                nuestro asistente automatizado (chatbot).
              </li>
              <li>
                Datos de tu membresía: plan contratado, clases a las que
                asistes y estatus de pago.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Finalidades
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 border-l-4 border-l-red-600 rounded-lg p-4">
                <p className="text-gray-700 text-sm">
                  <strong className="text-gray-900">Necesarias</strong> —
                  agendar clases, dar seguimiento a tu membresía, responder
                  dudas sobre planes y horarios, y atenderte a través de
                  nuestro chatbot.
                </p>
              </div>
              <div className="bg-white border border-gray-200 border-l-4 border-l-red-600 rounded-lg p-4">
                <p className="text-gray-700 text-sm">
                  <strong className="text-gray-900">No comercializamos</strong>{" "}
                  tus datos. No los compartimos con terceros, salvo
                  obligación legal expresa.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Derechos ARCO
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte
              (ARCO) al tratamiento de tus datos personales. Para
              ejercerlos, escríbenos indicando tu nombre completo y la
              solicitud específica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Eliminación de tus datos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Puedes solicitar la eliminación de tus datos personales,
              incluyendo tu historial de conversación con el chatbot de
              WhatsApp, Messenger o Instagram, en cualquier momento.
              Atenderemos tu solicitud en un plazo máximo de 20 días hábiles
              y te confirmaremos por el mismo medio una vez completada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Contacto
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Derechos ARCO
                </p>
                <a
                  href="mailto:info@realfighters.mx?subject=Derechos%20ARCO"
                  className="text-red-600 hover:underline"
                >
                  info@realfighters.mx
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  Asunto: &quot;Derechos ARCO&quot;
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Eliminar mis datos
                </p>
                <a
                  href="mailto:info@realfighters.mx?subject=Eliminar%20mis%20datos"
                  className="text-red-600 hover:underline"
                >
                  info@realfighters.mx
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  Asunto: &quot;Eliminar mis datos&quot;
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500">
          Real Fighters México · Calz. del Hueso 590, Coapa, Coyoacán, CDMX ·
          Este aviso puede actualizarse; la versión vigente siempre está
          disponible en esta página.
        </div>

        <div className="mt-8">
          <Link href="/" className="text-red-600 hover:underline text-sm">
            &larr; Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
