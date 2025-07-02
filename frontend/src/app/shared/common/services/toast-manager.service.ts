import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastItem, ToastType } from '../../models/UI';

@Injectable({
    providedIn: 'root',
})
export class ToastManagerService {
    private toasts$ = new BehaviorSubject<ToastItem[]>([]);
    private toastIdCounter = 0; 
    private defaultTimeout = 3000;

    getToasts(): Observable<ToastItem[]> {
        return this.toasts$.asObservable();
    }

    addToast(item: ToastItem): void {
        const toastItem: ToastItem = {
            ...item,
            id: this.toastIdCounter++,
        };
        const currentToasts = this.toasts$.value;
        this.toasts$.next([...currentToasts, toastItem]);
        this.removeToastAfterTimeout(toastItem);
    }

    private removeToastAfterTimeout(item: ToastItem): void {
        const timeout = this.getTimeoutByToastType(item.type);
        setTimeout(() => {
            this.removeToastById(item.id);
        }, timeout);
    }

    removeToastById(toastId?: number): void {
        const currentToasts = this.toasts$.value.filter((toast) => toast.id !== toastId);
        this.toasts$.next(currentToasts);
    }

    private getTimeoutByToastType(type: ToastType): number {
        switch (type) {
            case ToastType.SUCCESS:
                return this.defaultTimeout;
            case ToastType.ERROR:
                return 30000;
            case ToastType.WARNING:
                return 10000;
            case ToastType.INFO:
                return this.defaultTimeout;
            default:
                return this.defaultTimeout;
        }
    }
}