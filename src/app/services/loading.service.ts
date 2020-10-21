import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';
import { defer, NEVER } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private overlayRef: OverlayRef;
  private readonly loadingObservable = defer(() => {
    this.showOverlay();
    return NEVER.pipe(finalize(() => this.hideOverlay()));
  }).pipe(share());

  constructor(private overlay: Overlay) { }

  private showOverlay = () => {
    Promise
      .resolve(null)
      .then(() => {
        if (!this.overlayRef) {
          this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'white-backdrop',
            positionStrategy: this.overlay
              .position()
              .global()
              .centerHorizontally()
              .centerVertically()
          });
          this.overlayRef.attach(new ComponentPortal(MatSpinner));
        }
      });
  }

  private hideOverlay = () => {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = undefined;
    }
  }

  subscribe = () => this.loadingObservable.subscribe();
}
