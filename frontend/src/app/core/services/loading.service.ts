import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private static readonly SHOW_DELAY_MS = 200;
  private static readonly MIN_VISIBLE_MS = 600;

  private showTimerId: ReturnType<typeof setTimeout> | null = null;
  private hideTimerId: ReturnType<typeof setTimeout> | null = null;
  private visibleSince = 0;

  readonly pendingRequests = signal(0);
  readonly loading = signal(false);
  readonly uiLoading = signal(false);

  begin(): void {
    this.pendingRequests.update((n) => n + 1);
    this.loading.set(true);
    if (this.pendingRequests() > 1) return;

    this.clearShowTimer();
    if (this.uiLoading()) return;

    this.showTimerId = setTimeout(() => {
      this.showTimerId = null;
      if (this.pendingRequests() > 0) {
        this.visibleSince = Date.now();
        this.uiLoading.set(true);
      }
    }, LoadingService.SHOW_DELAY_MS);
  }

  end(): void {
    if (this.pendingRequests() === 0) return;

    this.pendingRequests.update((n) => n - 1);
    if (this.pendingRequests() > 0) return;

    this.loading.set(false);
    this.clearShowTimer();

    if (!this.uiLoading()) return;

    const elapsed = Date.now() - this.visibleSince;
    const remaining = Math.max(LoadingService.MIN_VISIBLE_MS - elapsed, 0);

    if (remaining === 0) {
      this.uiLoading.set(false);
      return;
    }

    this.hideTimerId = setTimeout(() => {
      this.hideTimerId = null;
      if (this.pendingRequests() === 0) {
        this.uiLoading.set(false);
      }
    }, remaining);
  }

  reset(): void {
    this.clearTimers();
    this.pendingRequests.set(0);
    this.loading.set(false);
    this.uiLoading.set(false);
  }

  private clearShowTimer(): void {
    if (this.showTimerId) {
      clearTimeout(this.showTimerId);
      this.showTimerId = null;
    }
  }

  private clearTimers(): void {
    this.clearShowTimer();
    if (this.hideTimerId) {
      clearTimeout(this.hideTimerId);
      this.hideTimerId = null;
    }
  }
}
