import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../models/api-response';
import { BaseModel } from '../models/base-model';
import { MavUtilsService } from './mav-utils.service';

@Injectable({
  providedIn: 'root'
})
export class MavDataService {

  baseURL = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private utilsService: MavUtilsService,
  ) { }


  saveData<T extends BaseModel>(url: string, data: T, customParams?: HttpParams | null, isFormData: boolean = false): Observable<IApiResponse<T>> {
    let values: any = null;

    let params = new HttpParams();

    if (customParams)
      params = customParams;

    if (isFormData)
      values = this.utilsService.objectToFormData(data);
    else
      values = data;


    if (isDevMode())
      console.log("Gönderilen veri", values);

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Accept', `application/json`);
    headers = headers.set('Authorization', `Bearer ${token}`);

    if (data.id) {
      return this.http.put<IApiResponse<T>>(`${this.baseURL}${url}`, values, { observe: 'response', headers: headers, params: params }).pipe(map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<T>>response.body);
        return <IApiResponse<T>>response.body;
      }))
    } else {
      return this.http.post<IApiResponse<T>>(`${this.baseURL}${url}`, values, { observe: 'response', headers: headers }).pipe(map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<T>>response.body);
        return <IApiResponse<T>>response.body;
      }))
    }
  }

  getById<T extends BaseModel>(url: string, id: string): Observable<IApiResponse<T>> {

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Accept', `application/json`);
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IApiResponse<T>>(`${this.baseURL}${url}/${id}`, { observe: 'response', headers }).pipe(
      map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<T>>response.body);
        return <IApiResponse<T>>response.body;
      })
    );
  }
  getData<T extends BaseModel>(url: string): Observable<IApiResponse<T>> {

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Accept', `application/json`);
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IApiResponse<T>>(`${this.baseURL}${url}`, { observe: 'response', headers }).pipe(
      map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<T>>response.body);
        return <IApiResponse<T>>response.body;
      })
    );
  }

  delete(url: string, id: string): Observable<IApiResponse<boolean>> {
    return this.http.delete(`${this.baseURL}${url}/${id}`, { observe: 'response' }).pipe(
      map((response) => {
        return <IApiResponse<boolean>>response.body;
      })
    );
  }

  getDataList<T extends BaseModel>(url: string, event?: LazyLoadEvent, customParams?: HttpParams): Observable<IApiResponse<T>> {
    let values: any = null;

    let params = new HttpParams();

    if (customParams)
      params = customParams;

    if (event) {
      params = this.utilsService.lazyLoadToCustomParams(event);
    }
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Accept', `application/json`);
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IApiResponse<T>>(`${this.baseURL}${url}`, { observe: 'response', headers, params }).pipe(
      map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<T>>response.body);
        return <IApiResponse<T>>response.body;
      })
    );
  }

  getDropdownDataList<T extends BaseModel>(url: string, query?: string, customParams?: HttpParams): Observable<IApiResponse<T>> {
    let values: any = null;

    let params = new HttpParams();

    if (customParams)
      params = customParams;

    if (query)
      params = params.append("Name", query);

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Accept', `application/json`);
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IApiResponse<T>>(`${this.baseURL}${url}`, { observe: 'response', headers, params }).pipe(
      map((response) => {
        if (isDevMode())
          console.log("Dönen veri", <IApiResponse<T>>response.body);
        return <IApiResponse<T>>response.body;
      })
    );
  }
}
