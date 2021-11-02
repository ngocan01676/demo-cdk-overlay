import { PtMenuComponent } from './pt-menu/pt-menu.component';
import { POSITION_MAP } from './connection-position-pair';
import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import {ConnectionPositionPair, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import { merge, Subject, Subscription } from 'rxjs';
import { debounceTime, filter,tap } from 'rxjs/operators';
import { ESCAPE, hasModifierKey} from '@angular/cdk/keycodes'
enum MenuState {
  closed = 'closed',
  opened = 'opened'
}
@Directive({
  selector: '[appPtMenuTrigger]'
})
export class PtMenuTriggerDirective implements OnInit,OnDestroy,AfterViewInit {

  //@Input() appPtMenuTrigger: TemplateRef<any>;
  @Input() appPtMenuTrigger: PtMenuComponent;
  @Input() ptMenuPostion = 'rightTop';
  @Input() triggerBy: 'click' | 'hover' | null = 'click';
  private menuState = 'close'
  private portal: TemplatePortal;
  private overlayRef: OverlayRef;
  private subcription: Subscription = Subscription.EMPTY;
  private readonly hover$ = new Subject<boolean>();
  private readonly click$ = new Subject<boolean>();
  private positions: ConnectionPositionPair[] = [
    POSITION_MAP.rightTop,
    POSITION_MAP.right
  ];
  constructor(
    private el:ElementRef,
    private overlay:Overlay,
    private vcr:ViewContainerRef) { }
  ngOnInit() {
    console.log(this.el);
  }
  ngAfterViewInit() {
    this.initialze();
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

  @HostListener('click',['$event'])
  onClick(event: MouseEvent) {
    if (!this.appPtMenuTrigger) return;
    //this.openMenu();
    this.click$.next(true);
  }

  @HostListener('mouseenter',['$event'])
  onMouseEnter() {
    this.hover$.next(true);
  }

  @HostListener('mouseleave',['$event'])
  onMouseLeave() {
    this.hover$.next(false);
  }
  openMenu() {
    if (this.menuState == MenuState.opened) return;
    const overlayConfig = this.getOverlayConfig();
    this.setOverlayPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy);
    const overlayRef = this.overlay.create(overlayConfig);
    overlayRef.attach(this.getPortal());
    this.subcriberOverlayEvent(overlayRef);
    this.overlayRef = overlayRef;
    this.menuState = MenuState.opened;
  }

  closeMenu() {
    if (this.menuState === MenuState.opened) {
      this.overlayRef?.detach();
      this.menuState = MenuState.closed;
    }
  }

  private initialze() {
    const menuVisible$ = this.appPtMenuTrigger.visible$;
    const hover$ = merge(
      menuVisible$,
      this.hover$
    ).pipe(
      debounceTime(100)
    )
    //const handle = this.triggerBy === 'hover' ? this.hover$ : this.click$;
    const handle = this.triggerBy === 'hover' ? hover$ : this.click$;
    handle.pipe(
      tap(state => {
        console.log(state)
      })
    ).subscribe((value) => {
      if (value) {
        this.openMenu();
        return;
      } else {
        this.closeMenu();
      }
    });
  }
  private getOverlayConfig(): OverlayConfig {
    // const positionPairs = [
    //   POSITION_MAP.rightTop,
    //   POSITION_MAP.bottomLeft
    // ];
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.el);
    return new OverlayConfig({
      positionStrategy,
      minWidth: '200px',
      width:'200px',
      hasBackdrop: this.triggerBy !== 'hover',
      backdropClass: 'pt-menu-backdrop',
      panelClass: 'pt-menu-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private setOverlayPosition(positionTrategy: FlexibleConnectedPositionStrategy) {
    positionTrategy.withPositions([...this.positions])
  }
  private getPortal(): TemplatePortal {
    // if (!this.portal || this.portal.templateRef !== this.appPtMenuTrigger)
    //   this.portal = new TemplatePortal<any>(this.appPtMenuTrigger,this.vcr);
    // return this.portal;
    if (!this.portal || this.portal.templateRef !== this.appPtMenuTrigger.menuTemplate)
    this.portal = new TemplatePortal<any>(this.appPtMenuTrigger.menuTemplate,this.vcr);
  return this.portal;
  }
  
  private subcriberOverlayEvent(overlayRef: OverlayRef) {
    this.subcription.unsubscribe();
    this.subcription = merge(
      overlayRef.backdropClick(),
      overlayRef.detachments(),
      overlayRef.keydownEvents().pipe(
        filter(event => event.keyCode === ESCAPE && !hasModifierKey(event))
      )
    ).subscribe(() => {
      this.closeMenu();
    });
  }
  
}
