import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Login, OnePercentObjDetails } from 'src/app/models/sales-orders-list';

@Injectable({
  providedIn: 'root'
})
export class AwsService {

  constructor(private http : HttpClient) { }

  uri = environment.apiProxy
  uriMobile = environment.apiMobile;

  getDashboard(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    const options = { headers: headers };

    return this.http.get(`${this.uri}/Mobile`, options)
  }

  postLogin(obj: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    const optios = { headers: headers };
    return this.http.post<Login>(`${this.uri}/Login`,obj, optios)
  }

  

}
