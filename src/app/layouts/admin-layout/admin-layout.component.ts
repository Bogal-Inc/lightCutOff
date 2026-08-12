import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { isMobile } from '@Helpers/mobile-confirm.helper';
import { AuthService } from '../../core/services-firebase';

@Component({
  standalone: false,
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isMobile: boolean;
  /** la sidebar n'apparaît que connecté-admin (pas sur /admin/login) */
  isAdmin$: Observable<boolean>;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isMobile = isMobile();
    this.isAdmin$ = this.authService.isAdmin$();
  }
}
