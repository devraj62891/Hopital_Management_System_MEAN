import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Doctor } from '../../model/doctor';
import { DoctorService } from '../../services/doctor';

@Component({
  selector: 'app-doctordashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctordashboard.html',
  styleUrls: ['./doctordashboard.css'],
})
export class Doctordashboard implements OnInit {
  

  get doctor(): Doctor | null {
    return this.doctorService.getLoggedInDoctor();
  }

  constructor(
    private router: Router,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
 
    if (!this.doctor) {
      this.router.navigate(['/doctor-login']);
    }
  }

  logout() {
    this.doctorService.logout().subscribe({
      next: () => {
        alert('Doctor logged out successfully');
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Server logout failed', err);
       
        this.doctorService.clearLoggedInDoctor();
        this.router.navigate(['/home']);
      }
    });
  }
}