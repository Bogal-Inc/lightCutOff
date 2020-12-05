import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {MarkerRecovredReportComponent} from '../../main/map/components/marker-recovred-report/marker-recovred-report.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
    ) {}

  createComponent(data, component, container: ViewContainerRef): any {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = container.createComponent(componentFactory);

    (componentRef.instance as MarkerRecovredReportComponent).data = data;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }
}
