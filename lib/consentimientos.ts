// Textos legales del formato de inscripción físico de Real Fighters México.
// Transcritos tal cual del formato impreso (solo se corrigieron acentos).
// Si cambia algún texto, sube CONSENT_VERSION para que las firmas nuevas queden
// ligadas a la versión correcta.

export const CONSENT_VERSION = '2026-09'

export type ConsentTipo = 'reglamento' | 'carta_compromiso' | 'aviso_privacidad' | 'carta_responsiva'

export const CONSENT_ORDER: ConsentTipo[] = [
  'reglamento',
  'carta_compromiso',
  'aviso_privacidad',
  'carta_responsiva',
]

export const CONSENTIMIENTOS: Record<ConsentTipo, { titulo: string; texto: string }> = {
  reglamento: {
    titulo: 'Reglamento de uso',
    texto: `REAL FIGHTERS MEXICO "Reforzamos valores con los alumnos logrando un crecimiento integral y ético, a través del ejercicio físico y la práctica deportiva, que les sirvan en su vida a través de instalaciones de primer nivel y profesores capacitados".

Cualquier punto no previsto en el reglamento pasará a consideración de la administración.

I. ACCESO Y ASISTENCIA
1. El uso de la academia es exclusivo para socios de REAL FIGHTERS MEXICO.
2. Alumno que llegue con aliento alcohólico o en estado inconveniente, será vetado del uso de la instalación.
3. Es obligatorio registrarse a la hora de entrada y salida de la academia; respetando en todo momento el horario al cual te inscribiste.
5. Menores de edad: deberán firmar el presente reglamento sus padres o tutores.

II. HIGIENE
1. Deberás usar ropa deportiva adecuada al ingresar, no está permitido el uso de prendas que no estén diseñadas para hacer ejercicio.
2. Es obligatorio para poder ingresar presentar una toalla pequeña para el sudor.
3. Se debe llegar a clase perfectamente aseado, uñas cortas, cabello recogido, sin maquillaje, sin joyería y es obligatorio ocupar productos de higiene personal.
4. Debes practicar con tu propio equipo completo y presentable, esto significa que el uniforme debe de estar limpio, planchado y en buenas condiciones, no se puede utilizar roto, perforado o cortarlo; debes utilizar ropa interior, playera, short, guantes, concha y bucal. NO COMPARTIR EQUIPO.
5. Se debe de realizar todo cambio de ropa en los vestidores respectivos (queda estrictamente prohibido cambiarse de ropa en áreas comunes). Para las clases de prueba, se solicita emplear ropa deportiva.

III. PREVENTIVO
1. No está permitido el acceso al área de entrenamiento con niños o con acompañantes.
2. Debes atender a todas las indicaciones de los instructores.
3. El alumno evitará al máximo la salida, solo en caso extremo lo solicitará y se deberá dar aviso al instructor por su propia seguridad, evita conversar con espectadores, padres y otro invitado mientras estás en clases.
Las personas de nuevo ingreso cuentan únicamente con un mes como máximo para entrenar sin uniforme y sin su equipo de protección.

IV. OBSERVACIONES
1. No introducir alimentos al área de entrenamiento, ni bebidas hidratantes y no dejes basura en el área. Se deberá de respetar los momentos señalados para hidratación.
2. No juegues o corras dentro del área de entrenamiento.
3. Respeta las áreas asignadas y los tiempos apoyándote con el instructor.
4. Deberás colocar el material en el lugar en donde corresponde.
5. No comas, bebas, masques chicle, fumes dentro de las instalaciones de la academia, no usar teléfono o dispositivos durante la clase.
6. No uses lenguaje vulgar dentro de la academia.
7. "Quitarse los zapatos" al entrar al área de entrenamiento.

V. SEGURIDAD
1. Para poder hacer uso de las instalaciones es tu responsabilidad el conocer y verificar tu estado de salud el cual te indicará si estás apto para la práctica dentro del mismo y seguir las instrucciones en todo momento.
2. Evita entrar al área de entrenamiento con dinero u objetos de valor que puedas perder dentro de la misma; el personal de RFM no se hará responsable de los extravíos que puedan ocurrir.
3. No puedes sacar material ni equipo de la academia.
4. Utiliza el equipo necesario de seguridad para tu entrenamiento.
5. No uses joyería durante la práctica, estas son causantes de lesiones a uno mismo o a tus compañeros.
6. En el caso que aplique hombres y/o mujeres deberán llevar el pelo recogido durante la práctica.
7. Se prohíbe a todos los alumnos que no podrán corregir a sus compañeros si el instructor se encuentra presente, así mismo se apercibe con baja definitiva a los alumnos que impartan clases de las disciplinas que se imparten en la academia sin previa autorización de su instructor.

VII. DURANTE TU ENTRENAMIENTO
1. Acude puntualmente a tu clase, y practica con todo tu potencial esforzándote al límite de tu resistencia, energía y concentración.
2. Conserva una mente fuerte y poderosa, no permitas que las dudas o temores te ensombrezcan.
3. Nunca muestres flojera ya que esta es contagiosa y contamina a tu equipo.
4. Sé realista y no te esfuerces más allá de los límites de seguridad.
5. Comenta cualquier problema con tu instructor directamente, no crees enemistades o políticas que afecten a la academia y a ti mismo.
6. Queda prohibido el uso de teléfonos celulares durante el desarrollo de las actividades de grupo.
7. No competir sin la vigilancia de un instructor y sin equipo de seguridad apropiado.`,
  },
  carta_compromiso: {
    titulo: 'Carta compromiso',
    texto: `El FIRMANTE, Alumno de la academia de Artes Marciales Mixtas denominada Real Fighters México, manifiesto bajo protesta de decir verdad en la presente CARTA COMPROMISO que cumpliré puntualmente todas las indicaciones necesarias para prevenir la propagación del Covid 19 y que me comprometo a cumplir puntualmente los lineamientos de medidas de protección a la salud conforme al sector del club deportivo y actividades deportivas en espacios abiertos de Real Fighters México, necesarias para reanudar actividades para un regreso seguro a la nueva normalidad en la Ciudad de México y que en este mismo acto soy conocedor de la responsabilidad de la que se incurre conforme al CAPÍTULO II del Código Penal para la Ciudad de México que a la letra establece, PELIGRO DE CONTAGIO ARTÍCULO 159. Al que sabiendo que padece una enfermedad grave en período infectante, ponga en peligro de contagio la salud de otro, por relaciones sexuales u otro medio transmisible, siempre y cuando la víctima no tenga conocimiento de esa circunstancia, se le impondrán prisión de tres meses a tres años y de cincuenta a trescientos días multa. Si la enfermedad padecida fuera incurable, se impondrán prisión de tres meses a diez años y de quinientos a dos mil días multa. Este delito se perseguirá por querella de la víctima u ofendido.

Así mismo en este acto deslindo de cualquier responsabilidad civil o penal por riesgo de contagio otorgando el perdón más amplio que en derecho corresponda, toda vez que me he percatado que en el establecimiento Real Fighters México se cumplen puntualmente todas las medidas de sanidad establecidas, reservándome acción y derecho alguno en su contra.`,
  },
  aviso_privacidad: {
    titulo: 'Aviso de privacidad',
    texto: `Los datos anteriores son recabados por REAL FIGHTERS MEXICO, en lo sucesivo "REAL FIGHTERS MEXICO", con domicilio en CALZADA DEL HUESO 400 antes 580, COLONIA LOS GIRASOLES, CÓDIGO POSTAL 04920, alcaldía Coyoacán, en la CIUDAD DE MÉXICO, en caso de ser Cliente con el fin de proveer y contratar los servicios y/o productos relacionados con el giro de la empresa, informarle sobre cambios en la línea de productos, precios, disponibilidad y condiciones de pago de los mismos, envío de información por medios electrónicos acerca de los productos comercializados por REAL FIGHTERS MEXICO, evaluar la calidad del servicio que le brinda REAL FIGHTERS MEXICO y prestar servicios de atención al Cliente; en caso de ser Proveedor con el fin de contratar y promover los servicios y/o productos relacionados con promociones y publicidad, realizar consultas acerca de los servicios y productos que REAL FIGHTERS MEXICO comercializa, obtener cotizaciones y efectuar pagos por sus servicios y verificación de sus datos y obtención de referencias comerciales; en caso de ser Empleado con el fin de verificar antecedentes laborales y académicos, realizar actividades de selección y contratación de personal, incluir en su expediente laboral e inscribirlo en los registros que corresponden, de conformidad con la legislación laboral y de seguridad social aplicable; en caso de ser Socio de Negocios / Asociado con el fin de enviar información por medios electrónicos acerca de los productos comercializados por REAL FIGHTERS MEXICO y por sus proveedores, preparar documentación legal relacionada con REAL FIGHTERS MEXICO y proporcionarla a entidades financieras en relación con préstamos de REAL FIGHTERS MEXICO.

Para mayor información acerca del tratamiento y de los derechos que puede hacer valer, usted puede tener acceso al aviso de privacidad completo solicitándolo en el Departamento de Recursos Humanos de REAL FIGHTERS MÉXICO en el domicilio antes descrito, o al correo electrónico DATOSPERSONALES@REALFIGHTERS.COM.MX`,
  },
  carta_responsiva: {
    titulo: 'Carta responsiva',
    texto: `El que suscribe, FIRMANTE, Alumno(a) de la academia de artes marciales mixtas denominada Real Fighters México, manifiesto bajo protesta de decir verdad lo que a continuación se menciona: me obligo a respetar en todo momento las medidas de seguridad, me comprometo a que en todo momento procuraré el deber de cuidado para evitar cualquier lesión para mí o para mis compañeros, evitando que existan lesiones por cualquier omisión de mi parte o de mis compañeros, respetaré las medidas sanitarias, y guardaré en todo momento el debido comportamiento dentro de la academia; asimismo, conocedor del riesgo que esta actividad de contacto implica, desde este momento deslindo de toda responsabilidad civil o penal a la academia, representantes o colaboradores, respecto de cualquier accidente o lesión que pudiera sufrir en mi persona con motivo de negligencia, competencia, práctica, descuido o imprudencia en la que pueda incurrir al hacer uso de las instalaciones de la academia; extendiendo en este acto el perdón más amplio que en derecho corresponda a todos los responsables de la academia; asimismo en este acto ratifico todas y cada una de las manifestaciones contenidas en este documento y firmo al calce como constancia legal.`,
  },
}
