
import { Injectable } from '@angular/core';
import { Patient } from '../model/patient';
import { PatientMedicalHistory } from '../model/patient-medical-history';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  // private apiUrl = 'http://localhost:5000/patient';
  private apiUrl = 'https://hopital-management-system-mean.vercel.app/patient';

  private currentPatientSubject = new BehaviorSubject<Patient | null>(null);
  public currentPatient$ = this.currentPatientSubject.asObservable();
  
  private registeredPatients: Patient[] = [];

  constructor(private http: HttpClient) {
    // Restore session from sessionStorage on app refresh
    const savedPatient = sessionStorage.getItem('loggedInPatient');
    if (savedPatient) {
      try {
        this.currentPatientSubject.next(JSON.parse(savedPatient));
      } catch (e) {
        sessionStorage.removeItem('loggedInPatient');
      }
    }
  }


  private getAuthHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- AUTHENTICATION & SESSION MANAGEMENT ---

  register(patient: Patient): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, patient);
  }

  setCurrentPatient(patient: Patient, token?: string): void {
    if (token) {
      sessionStorage.setItem('token', token);
    }
    sessionStorage.setItem('loggedInPatient', JSON.stringify(patient));
    this.currentPatientSubject.next(patient);
  }

  getLoggedInPatient(): Patient | null {
    return this.currentPatientSubject.value;
  }

  clearLocalSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedInPatient');
    this.currentPatientSubject.next(null);
  }

  logout(): Observable<any> {
  
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { headers: this.getAuthHeaders() })
      .pipe(tap(() => this.clearLocalSession()));
  }

  getProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/profile`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap((patient) => {
        this.setCurrentPatient(patient); 
      }),
    );
  }

  updateProfile(updated: Patient): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/update/${updated.email}`, updated, { 
        headers: this.getAuthHeaders() 
      })
      .pipe(
        tap(() => {
          this.setCurrentPatient(updated); 
        }),
      );
  }

  
  bookAppointmentDB(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book-appointment`, bookingData, {
      headers: this.getAuthHeaders(),
    });
  }

  rescheduleAppointmentDB(appointmentID: string, newDate: string, newTime: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/appointment/${appointmentID}`,
      { newDate, newTime },
      { headers: this.getAuthHeaders() },
    );
  }

  cancelAppointmentDB(appointmentID: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/appointment/${appointmentID}/cancel`,
      {},
      { headers: this.getAuthHeaders() },
    );
  }

  getPatientAppointmentsDB(patientID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${patientID}/appointments`, {
      headers: this.getAuthHeaders(),
    });
  }

  getMedicalHistoryDB(patientID: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${patientID}/medical-history`, {
      headers: this.getAuthHeaders(),
    });
  }

 

  getMedicalHistory(): PatientMedicalHistory | undefined {
    return this.currentPatientSubject.value?.medicalHistory;
  }

  saveMedicalHistory(history: PatientMedicalHistory): void {
    const current = this.currentPatientSubject.value;
    if (current) {
      current.medicalHistory = history;
      this.setCurrentPatient(current);
    }
  }

  getPatientById(patientID: string): Patient {
    const found = this.registeredPatients.find((p) => p.patientID === patientID);
    if (!found) {
      const current = this.currentPatientSubject.value;
      if (current?.patientID === patientID) return current;
      return { firstName: 'Unknown', lastName: 'Patient', patientID } as Patient;
    }
    return found;
  }
}