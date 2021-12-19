import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../models/api-response';
import { CurrentUser } from '../models/current-user';
import { MavDataService } from './mav-data.service';

@Injectable({
  providedIn: 'root'
})
export class MavAuthService {
  baseURL = environment.baseUrl;

  private currentUserSource = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(emailOrUserName: string, password: string, rememberMe: boolean = false): Observable<IApiResponse<CurrentUser>> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', `application/json`);

    const loginDto = {
      emailOrUserName,
      password,
      rememberMe,
    }
    return this.http.post<IApiResponse<CurrentUser>>(`${this.baseURL}/Account/Login`, loginDto, { observe: 'response', headers }).pipe(
      map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<CurrentUser>>response.body);

        let apiResponse = <IApiResponse<CurrentUser>>response.body
        if (apiResponse.isSuccess && apiResponse.dataSingle && apiResponse.dataSingle.token) {
          this.currentUserSource.next(apiResponse.dataSingle);
          localStorage.setItem('token', apiResponse.dataSingle.token);
        }
        return apiResponse;
      })
    )
  }

  logout(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token == null)
      localStorage.removeItem('token');

    this.currentUserSource.next(null);
    const currentURL = this.router.url;

    let headers = new HttpHeaders();
    headers = headers.set('Accept', `application/json`);
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseURL}/Account/Logout`, { observe: 'response', headers }).pipe(
      map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<boolean>>response.body);

        let apiResponse = <IApiResponse<boolean>>response.body
        if (apiResponse.isSuccess) {
          this.router.navigate(['Account/Login'], { queryParams: { returnUrl: currentURL } });
          return true;
        }

        return false;
      })
    )
  }
}
