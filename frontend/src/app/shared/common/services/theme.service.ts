import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { AuthService } from "../../../core/auth/service/auth.service";

@Injectable({
    providedIn: "root"
})
export class ThemeService {
    private currentThemeSubject: BehaviorSubject<string>;
    public currentTheme$: Observable<string>;
    private renderer: Renderer2;
    private authSubscription: Subscription = new Subscription();

    constructor(
        private authService: AuthService,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);

        this.currentThemeSubject = new BehaviorSubject<string>("light");
        this.currentTheme$ = this.currentThemeSubject.asObservable();

        this.authSubscription.add(
            this.authService.currentUser$.subscribe(user => {
                const newTheme = user?.userSettings?.appTheme || "light";
                if (this.currentThemeSubject.getValue() !== newTheme) {
                    this.currentThemeSubject.next(newTheme);
                    this.applyThemeToBody(newTheme);
                }
            })
        );

        this.applyThemeToBody(this.currentThemeSubject.getValue());
    }

    private applyThemeToBody(theme: string): void {
        this.renderer.removeClass(document.body, "light-theme");
        this.renderer.removeClass(document.body, "dark-theme");

        if (theme === "dark") {
            this.renderer.addClass(document.body, "dark-theme");
        } else {
            this.renderer.addClass(document.body, "light-theme");
        }
    }

    setTheme(theme: string): void {
        this.currentThemeSubject.next(theme);
        this.applyThemeToBody(theme);
    }

    getTheme(): string {
        return this.currentThemeSubject.value;
    }

    toggleTheme(): void {
        var theme = "dark";
        if (this.currentThemeSubject.value === "dark") {
            theme = "light";
        }
        this.currentThemeSubject.next(theme);
        this.applyThemeToBody(theme);
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}