import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-card-promedio',
  imports: [CommonModule],
  templateUrl: './card-promedio.html',
  styleUrl: './card-promedio.scss',
})
export class CardPromedio {
    @Input() promedio: number = 0;

}
