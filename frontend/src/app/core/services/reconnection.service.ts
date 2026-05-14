import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReconnectionService {
  private static readonly DELAY_MS = 5000;
  private static readonly MAX_ATTEMPTS = 3;

  private reconnectTimerId: ReturnType<typeof setInterval> | null = null;
  private countdownTimerId: ReturnType<typeof setInterval> | null = null;
  private onRetry: (() => void) | null = null;

  readonly reconnecting = signal(false);
  readonly reconnectAttempts = signal(0);
  readonly reconnectExhausted = signal(false);
  readonly countdown = signal(0);
  readonly diagnosticCode = signal('');
  readonly networkOnline = signal(true);

  start(onRetry: () => void): void {
    if (this.reconnecting()) return;

    this.reconnecting.set(true);
    this.countdown.set(ReconnectionService.DELAY_MS / 1000);
    this.onRetry = onRetry;
    this.updateDiagnosticCode();
    this.startCountdown();
    this.startInterval();
  }

  stop(): void {
    if (this.reconnectTimerId) {
      clearInterval(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }
    if (this.countdownTimerId) {
      clearInterval(this.countdownTimerId);
      this.countdownTimerId = null;
    }
    this.countdown.set(0);
    this.reconnecting.set(false);
  }

  setOnline(online: boolean): void {
    this.networkOnline.set(online);
    this.updateDiagnosticCode();
  }

  reset(): void {
    this.stop();
    this.reconnectAttempts.set(0);
    this.reconnectExhausted.set(false);
    this.diagnosticCode.set('');
  }

  private startInterval(): void {
    this.reconnectTimerId = setInterval(() => {
      this.tryRetry();
    }, ReconnectionService.DELAY_MS);
  }

  private startCountdown(): void {
    this.countdownTimerId = setInterval(() => {
      const next = this.countdown() - 1;
      this.countdown.set(Math.max(next, 0));
    }, 1000);
  }

  private tryRetry(): void {
    if (this.reconnectAttempts() >= ReconnectionService.MAX_ATTEMPTS) {
      this.reconnectExhausted.set(true);
      this.stop();
      return;
    }

    this.reconnectAttempts.update((n) => n + 1);
    this.countdown.set(ReconnectionService.DELAY_MS / 1000);
    this.updateDiagnosticCode();
    this.onRetry?.();
  }

  private updateDiagnosticCode(): void {
    const online = this.networkOnline() ? 'ON' : 'OFF';
    this.diagnosticCode.set(
      `BIP-CONN-${Date.now()}-A${this.reconnectAttempts()}-${online}`
    );
  }
}
