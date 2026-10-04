import { Component, inject, OnInit, signal } from '@angular/core';
import { ConsultaTecnica } from '../../../core/domain/models/consulta.model';
import { GetAdvisoryQueriesUseCase } from '../../../core/use-cases/advisory/get-advisory-queries.use-case';
import { SendAdvisoryQueryUseCase } from '../../../core/use-cases/advisory/send-advisory-query.use-case';

@Component({
  selector: 'app-advisory',
  template: `
    <h1 class="text-xl font-bold">Asesoría técnica</h1>
    <p class="text-sm text-stone-600">Pregunta a nuestros técnicos agrícolas.</p>

    <textarea
      rows="3"
      placeholder="Escribe tu duda sobre el cultivo..."
      (input)="question.set($any($event.target).value)"
      [value]="question()"
      class="w-full mt-3 rounded-xl border border-stone-300 p-3 bg-white"
    ></textarea>

    <button (click)="enviar()" class="mt-2 w-full bg-brand text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2">
      <span class="material-icons-round">send</span>
      Enviar consulta
    </button>

    @if (ok()) {
      <div class="mt-3 rounded-xl bg-green-100 text-green-900 p-3 text-sm flex items-center gap-2">
        <span class="material-icons-round">check_circle</span>
        Consulta enviada.
      </div>
    }

    <h2 class="mt-6 mb-2 font-bold">Consultas recientes</h2>
    <div class="space-y-3">
      @for (c of consultas(); track c.pregunta) {
        <div class="bg-white rounded-2xl p-4 border">
          <p class="font-semibold">{{ c.pregunta }}</p>
          <p class="mt-1 text-sm text-stone-700">{{ c.respuesta }}</p>
          <p class="mt-2 text-xs text-earth">— {{ c.tecnico }}</p>
        </div>
      }
    </div>
  `,
})
export class AdvisoryPageComponent implements OnInit {
  private readonly getQueries = inject(GetAdvisoryQueriesUseCase);
  private readonly sendQuery = inject(SendAdvisoryQueryUseCase);

  readonly consultas = signal<ConsultaTecnica[]>([]);
  readonly question = signal('');
  readonly ok = signal(false);

  async ngOnInit() {
    this.consultas.set(await this.getQueries.execute());
  }

  async enviar() {
    if (!this.question().trim()) return;
    await this.sendQuery.execute(this.question());
    this.question.set('');
    this.ok.set(true);
    this.consultas.set(await this.getQueries.execute());
  }
}
