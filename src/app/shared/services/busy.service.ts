import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  constructor() { }

  setBusy() {
    const loader = document.getElementById('ftco-loader');
    if (!loader?.classList.contains('show')) {
      loader?.classList.add('show');
    }
  }

  setIdle() {
    const loader = document.getElementById('ftco-loader');
    if (loader?.classList.contains('show')) {
      loader?.classList.remove('show');
    }
  }
}
