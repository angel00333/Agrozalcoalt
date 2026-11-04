
import { Component, signal } from '@angular/core';
import { getMoonIllumination } from 'suncalc';

interface Fase {
    nombre: string;
    icono: string;
    consejo: string;
}

interface DatosLuna {
    nombre: string;
    icono: string;
    iluminacion: number;
    fechaActual: string;
    siguienteNombre: string;
    siguienteIcono: string;
    siguienteFecha: string;
    diasRestantes: number;
    consejo: string;
}

@Component({
    selector: 'app-fase-lunar',
    standalone: true,
    template: `
    <section
      class="relative w-full overflow-hidden rounded-3xl border border-[#619c7b]/70 bg-gradient-to-br from-[#062c29] via-[#074e3c] to-[#032f27] text-white shadow-2xl"
    >
      <!-- Encabezado -->
      <div class="relative flex flex-wrap items-center justify-between gap-4 px-5 pt-6 sm:px-7">

        <div class="flex items-center gap-4">
          <div
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#154b32] text-3xl shadow-lg"
          >
            🌙
          </div>

          <div>
            <h2 class="text-2xl font-bold text-[#e5f6df] sm:text-3xl">
              Fase lunar agrícola
            </h2>

            <p class="mt-1 text-sm text-[#d3e9db]">
              Conoce las fases de la Luna y las tradiciones del campo.
            </p>
          </div>
        </div>

        <button
          type="button"
          (click)="actualizar()"
          class="rounded-xl border border-[#80ae8c]/60 px-4 py-2 text-sm font-semibold text-[#e5f6df] transition hover:bg-white/10"
        >
          ↻ Actualizar
        </button>
      </div>

      <!-- Tres áreas de contenido -->
      <div
        class="relative grid gap-4 px-5 pb-5 pt-5 sm:px-7 sm:pb-7 lg:grid-cols-[1.1fr_1fr_0.95fr]"
      >

        <!-- 1. Paisaje agrícola -->
        <div
          class="relative min-h-[230px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#102d41] via-[#1f574d] to-[#062d26]"
        >
          <!-- Ilustración vectorial del paisaje -->
          <svg
            viewBox="0 0 540 250"
            preserveAspectRatio="xMidYMid slice"
            class="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="cieloLunar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0d263c"/>
                <stop offset="70%" stop-color="#36634f"/>
                <stop offset="100%" stop-color="#163b2d"/>
              </linearGradient>
              <radialGradient id="brilloLunar">
                <stop offset="0%" stop-color="#ffe4a1"/>
                <stop offset="100%" stop-color="#c9aa69"/>
              </radialGradient>
            </defs>

            <rect width="540" height="250" fill="url(#cieloLunar)"/>

            <!-- Estrellas -->
            <g fill="#f7dfb0" opacity="0.85">
              <circle cx="42" cy="35" r="1.5"/>
              <circle cx="98" cy="65" r="1"/>
              <circle cx="148" cy="20" r="1.5"/>
              <circle cx="230" cy="50" r="1"/>
              <circle cx="300" cy="25" r="1.5"/>
              <circle cx="458" cy="37" r="1"/>
              <circle cx="503" cy="85" r="1.5"/>
            </g>

            <!-- Luna -->
            <circle
              cx="378"
              cy="66"
              r="43"
              fill="#f5c77a"
              opacity="0.14"
            />
            <circle
              cx="378"
              cy="66"
              r="34"
              fill="url(#brilloLunar)"
            />

            <!-- Montañas -->
            <path
              d="M0 172 L75 112 L135 166 L210 103 L305 180 L380 125 L460 181 L540 115 L540 250 L0 250Z"
              fill="#173e3b"
            />
            <path
              d="M0 195 Q105 140 200 190 T390 170 T540 187 L540 250 L0 250Z"
              fill="#0b4b39"
            />

            <!-- Terreno -->
            <path
              d="M0 205 Q270 160 540 207 L540 250 L0 250Z"
              fill="#143c29"
            />

            <!-- Surcos agrícolas -->
            <g fill="none" stroke="#549b46" stroke-width="5">
              <path d="M260 206 Q100 219 -50 250"/>
              <path d="M275 206 Q215 223 165 255"/>
              <path d="M285 207 Q310 226 330 255"/>
              <path d="M300 208 Q410 225 510 255"/>
              <path d="M320 210 Q480 216 610 240"/>
            </g>

            <!-- Casa rural -->
            <rect x="65" y="160" width="67" height="51" fill="#493c2d"/>
            <path d="M56 164 L98 128 L140 164Z" fill="#281f1b"/>
            <rect x="92" y="174" width="18" height="37" fill="#e6b451"/>
            <rect x="71" y="174" width="13" height="13" fill="#e6b451"/>

            <!-- Árbol -->
            <path
              d="M466 188 L467 137"
              stroke="#352a21"
              stroke-width="8"
            />
            <g fill="#174f32">
              <circle cx="445" cy="135" r="25"/>
              <circle cx="475" cy="115" r="29"/>
              <circle cx="502" cy="140" r="23"/>
            </g>
          </svg>

          <div
            class="absolute bottom-3 left-3 rounded-full bg-[#062d23]/80 px-3 py-1.5 text-xs text-[#e0eedc]"
          >
            🌾 Tradición y naturaleza
          </div>
        </div>

        <!-- 2. Datos astronómicos -->
        <div
          class="grid grid-cols-2 items-stretch gap-3 rounded-2xl bg-[#053a2f]/70 p-3 sm:p-4"
        >

          <div class="flex flex-col items-center justify-center text-center">
            <p class="text-sm font-bold text-[#bcebaa]">
              Fase actual
            </p>

            <div
              class="my-3 text-5xl sm:text-6xl"
              role="img"
              [attr.aria-label]="datos().nombre"
            >
              {{ datos().icono }}
            </div>

            <p class="font-bold text-[#f7f4e8]">
              {{ datos().nombre }}
            </p>

            <p class="mt-2 text-xs text-[#c5dfcd]">
              {{ datos().iluminacion }}% iluminada
            </p>
          </div>

          <div class="flex flex-col items-center justify-center border-l border-[#5b9874]/50 pl-3 text-center">
            <p class="text-sm font-bold text-[#bcebaa]">
              Próxima fase
            </p>

            <div
              class="my-3 text-5xl sm:text-6xl"
              role="img"
              [attr.aria-label]="datos().siguienteNombre"
            >
              {{ datos().siguienteIcono }}
            </div>

            <p class="font-bold text-[#f7f4e8]">
              {{ datos().siguienteNombre }}
            </p>

            <p class="mt-2 text-xs text-[#c5dfcd]">
              {{ datos().siguienteFecha }}
            </p>

            <p class="mt-1 text-xs font-semibold text-[#f7c44d]">
              Aproximadamente en
              {{ datos().diasRestantes }}
              día(s)
            </p>
          </div>
        </div>

        <!-- 3. Tradición agrícola -->
        <div
          class="flex flex-col justify-center rounded-2xl border border-[#7baf69]/50 bg-gradient-to-br from-[#164d30] to-[#103a2c] p-5 shadow-lg"
        >
          <h3 class="text-lg font-bold text-[#f7c44d]">
            🌱 Sabiduría agrícola
          </h3>

          <p class="mt-4 text-sm leading-7 text-[#e3f1de]">
            {{ datos().consejo }}
          </p>

          <p class="mt-4 border-t border-[#6b9e79]/40 pt-3 text-xs leading-5 text-[#b9d5bf]">
            Estas prácticas forman parte de la tradición
            agrícola. Las decisiones de cultivo deben
            considerar el clima, el suelo y la asesoría
            agronómica.
          </p>
        </div>
      </div>

      <!-- Pie del componente -->
      <p class="px-5 pb-4 text-center text-xs text-[#b7d8c1]">
        Datos lunares calculados con SunCalc.
        Consulta: {{ datos().fechaActual }}
      </p>
    </section>
  `
})
export class FaseLunarComponent {

    // IMPORTANTE: Las fases deben inicializarse
    // antes de calcular los datos lunares.

    private readonly fases: Fase[] = [
        {
            nombre: 'Luna nueva',
            icono: '🌑',
            consejo: 'Tradicionalmente, algunos agricultores utilizan esta fase para preparar el terreno y organizar futuras siembras.'
        },
        {
            nombre: 'Luna creciente',
            icono: '🌒',
            consejo: 'En la tradición agrícola, se relaciona con la siembra de cultivos que producen hojas y frutos sobre la tierra.'
        },
        {
            nombre: 'Cuarto creciente',
            icono: '🌓',
            consejo: 'Algunos calendarios tradicionales asocian esta fase con la siembra y el cuidado de las plantas.'
        },
        {
            nombre: 'Luna gibosa creciente',
            icono: '🌔',
            consejo: 'Se considera tradicionalmente una etapa para observar el desarrollo de los cultivos y organizar labores agrícolas.'
        },
        {
            nombre: 'Luna llena',
            icono: '🌕',
            consejo: 'La luna llena ha sido utilizada por generaciones de agricultores como referencia para organizar las labores del campo.'
        },
        {
            nombre: 'Luna gibosa menguante',
            icono: '🌖',
            consejo: 'Algunas tradiciones relacionan esta fase con el mantenimiento de cultivos y la preparación de otras actividades.'
        },
        {
            nombre: 'Cuarto menguante',
            icono: '🌗',
            consejo: 'Tradicionalmente se asocia con actividades de mantenimiento, limpieza y preparación del suelo.'
        },
        {
            nombre: 'Luna menguante',
            icono: '🌘',
            consejo: 'En algunos calendarios agrícolas se utiliza esta etapa para planificar el siguiente ciclo de cultivo.'
        }
    ];

    readonly datos = signal<DatosLuna>(
        this.calcularDatos(new Date())
    );

    actualizar(): void {
        this.datos.set(this.calcularDatos(new Date()));
    }

    private calcularDatos(fecha: Date): DatosLuna {

        const luna = getMoonIllumination(fecha);
        const indice = Math.round(luna.phase * 8) % 8;
        const faseActual = this.fases[indice];

        const proxima = this.calcularProximaFase(
            fecha,
            luna.phase
        );

        const diasRestantes = Math.max(
            0,
            Math.ceil(
                (proxima.fecha.getTime() - fecha.getTime()) /
                86400000
            )
        );

        return {
            nombre: faseActual.nombre,
            icono: faseActual.icono,
            iluminacion: Math.round(luna.fraction * 100),
            fechaActual: this.formatearFecha(fecha),
            siguienteNombre: proxima.nombre,
            siguienteIcono: proxima.icono,
            siguienteFecha: this.formatearFecha(proxima.fecha),
            diasRestantes,
            consejo: faseActual.consejo
        };
    }

    private calcularProximaFase(
        desde: Date,
        faseActual: number
    ): {
        nombre: string;
        icono: string;
        fecha: Date;
    } {

        const principales = [
            { nombre: 'Luna nueva', icono: '🌑' },
            { nombre: 'Cuarto creciente', icono: '🌓' },
            { nombre: 'Luna llena', icono: '🌕' },
            { nombre: 'Cuarto menguante', icono: '🌗' }
        ];

        const indice = Math.floor(faseActual * 4) + 1;
        const objetivo = indice / 4;
        const siguiente = principales[indice % 4];

        const hora = 60 * 60 * 1000;

        for (let h = 1; h <= 300; h++) {

            const fecha = new Date(
                desde.getTime() + h * hora
            );

            let fase = getMoonIllumination(fecha).phase;

            // Considera el reinicio del ciclo lunar.
            if (objetivo === 1 && fase < 0.5) {
                fase += 1;
            }

            if (fase >= objetivo) {
                return {
                    ...siguiente,
                    fecha
                };
            }
        }

        // Estimación de respaldo con mes sinódico medio.
        const dias = (objetivo - faseActual) * 29.530588;

        return {
            ...siguiente,
            fecha: new Date(
                desde.getTime() + dias * 24 * hora
            )
        };
    }

    private formatearFecha(fecha: Date): string {
        return new Intl.DateTimeFormat('es-SV', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(fecha);
    }
}
