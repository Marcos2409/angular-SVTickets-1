import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  User,
  UserPasswordEdit,
  UserPhotoEdit,
  UserProfileEdit,
} from '../../shared/interfaces/user';
import { SingleUserResponse } from '../../shared/interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  #http = inject(HttpClient);

  getProfile(id?: number): Observable<User> {
    if (id) {
      return this.#http
        .get<SingleUserResponse>(`users/${id}`)
        .pipe(map((resp) => resp.user));
    }
    return this.#http
      .get<SingleUserResponse>(`users/me`)
      .pipe(map((resp) => resp.user));
  }

  updateProfile(userData: UserProfileEdit): Observable<void> {
    return this.#http.put<void>(`users/me`, userData).pipe(map((resp) => resp));
  }

  updateProfileAvatar(userAvatar: UserPhotoEdit): Observable<void> {
    return this.#http
      .put<void>(`users/me/photo`, userAvatar)
      .pipe(map((resp) => resp));
  }

  updateUserPassword(userPassword: UserPasswordEdit): Observable<void> {
    return this.#http
      .put<void>(`users/me/password`, userPassword)
      .pipe(map((resp) => resp));
  }
}
