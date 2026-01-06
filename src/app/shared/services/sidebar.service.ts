import { Injectable, signal } from '@angular/core';

@Injectable({ 
    providedIn: 'root' 
})
export class SidebarService {

    private _close = signal<boolean>(false);

    close = this._close.asReadonly();

    get getCloseStatus() {
        return this.close();
    }

    toggle() {
        this._close.update(v => !v);
    }

    openSidebar() {
        this._close.set(false);
    }

    closeSidebar() {
        this._close.set(true);
    }
}
