import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserDetailsUtilityService {

  constructor(private http: HttpClient, private storage: Storage, private router: Router,private authservice:AuthService) { }

  url = environment.url;
  id = '';

  getUser(token) {
    return this.http.get(`${this.url}/api/user?token=${token}`);
  }

  getUserDetails(token) {
    return this.http.get(`${this.url}/api/editAuthUserDetails`,{
      headers: {'Authorization':`Bearer ${token}`,'Content-Type':'application/x-www-form-urlencoded'}
   });
  }

  getAllUserDetails(token) {
    return this.http.get(`${this.url}/api/showUserAndDetails`,{
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  getAllBands() {
    return this.http.get(`${this.url}/api/showRole0`)
  }

  getAllVenues() {
    return this.http.get(`${this.url}/api/showRole1`)
  }

  getUserById(token,id) {
    return this.http.get(`${this.url}/api/showUserAndDetails/${id}`,{
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  addDetails(credentials, token) {
    return this.http.post(`${this.url}/api/storeUserDetails`, this.getFormUrlEncoded(credentials),{
      headers: {'Authorization':`Bearer ${token}`,'Content-Type':'application/x-www-form-urlencoded'}
   }).pipe(
    tap(() => {
      this.authservice.authenticationState.next(true);
      this.router.navigate(['menu/profile']);
    }),
    catchError(e => {
      throw new Error(e);
    })
  );
  }

   editDetails(credentials, token) {
    console.log(credentials);
    return this.http.patch(`${this.url}/api/updateAuthUserDetails`, this.getFormUrlEncoded(credentials),{
      headers: {'Authorization':`Bearer ${token}`,'Content-Type':'application/x-www-form-urlencoded'}
   }).pipe(
    tap(() => {
      this.router.navigate(['menu/profile']);
    }),
    catchError(e => {
      throw new Error(e);
    })
  );
  }

  sendRequest(credentials,token,id) {
    return this.http.post(
      `${this.url}/api/storeRequest/${id}`, 
      credentials,
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  showRequestsByUser(token) {
    return this.http.get(
      `${this.url}/api/showRequestsByUser`, 
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  acceptRequest(id, token) {
    return this.http.get(
      `${this.url}/api/acceptRequest/${id}`, 
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  declineRequest(id, token) {
    return this.http.get(
      `${this.url}/api/declineRequest/${id}`, 
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  displayRequestsRecievedDetails(token) {
    return this.http.get(
      `${this.url}/api/requestingUsersToAuth`, 
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }


  storeReview(credentials,token,id) {
    return this.http.post(
      `${this.url}/api/storeReview/${id}`, 
      credentials,
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  showReviews(id, token) {
    return this.http.get(
      `${this.url}/api/showReviews/${id}`, 
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }

  myReviews(token) {
    return this.http.get(
      `${this.url}/api/myReviews`, 
      {
      headers: {'Authorization':`Bearer ${token}`}
   });
  }


  getFormUrlEncoded(toConvert) {
		const formBody = [];
		for (const property in toConvert) {
			const encodedKey = encodeURIComponent(property);
			const encodedValue = encodeURIComponent(toConvert[property]);
			formBody.push(encodedKey + '=' + encodedValue);
		}
		return formBody.join('&');
  }
  
}
