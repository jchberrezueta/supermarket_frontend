import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-landing-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export default class HomeComponent {

  currentSlide = signal(0);

  slides = [
    {
      title: 'Supermarket Family',
      text: 'Tu supermercado de confianza, ahora también en línea.'
    },
    {
      title: 'Todo en un solo lugar',
      text: 'Alimentos, productos del hogar y más, al mejor precio.'
    },
    {
      title: 'Compra fácil y rápida',
      text: 'Desde tu casa o visitando nuestras tiendas físicas.'
    }
  ];

  next(): void {
    this.currentSlide.set(
      (this.currentSlide() + 1) % this.slides.length
    );
  }
}
