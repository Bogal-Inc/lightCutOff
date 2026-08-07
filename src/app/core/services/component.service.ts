import {Injectable, Type, ViewContainerRef} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  createComponent<T extends { data: unknown }>(data, component: Type<T>, container: ViewContainerRef): HTMLElement {
    const componentRef = container.createComponent(component);

    componentRef.instance.data = data;
    componentRef.hostView.detectChanges();
    const { nativeElement } = componentRef.location;

    return nativeElement;
  }
}
