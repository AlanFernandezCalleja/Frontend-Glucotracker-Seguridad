import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SafeUrlPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
