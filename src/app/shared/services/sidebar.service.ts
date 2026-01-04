import { Injectable, signal } from '@angular/core';

@Injectable({ 
    providedIn: 'root' 
})
export class SidebarService {

    public close = signal<boolean>(false);

    get getCloseStatus() {
        return this.close();
    }

    toggle() {
        this.close.update(v => !v);
    }

    openSidebar() {
        this.close.set(false);
    }

    closeSidebar() {
        this.close.set(true);
    }
}
