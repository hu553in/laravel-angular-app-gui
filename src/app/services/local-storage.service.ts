import { Injectable } from '@angular/core';
import { add, formatISO, isPast, parseISO } from 'date-fns';
import { User } from 'src/app/models/user.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  getJwt = () => localStorage.getItem('token');

  setJwt = (token: string, tokenType: string, expiresIn: number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('token_type', tokenType);
    localStorage.setItem(
      'expiration_iso',
      formatISO(add(new Date(), { seconds: expiresIn }))
    );
  }

  isJwtPresent = () => !!localStorage.getItem('token');

  hasJwtExpired = () =>
    isPast(parseISO(localStorage.getItem('expiration_iso')))

  removeJwt = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expiration_iso');
  }

  setUser = (user: User) => localStorage.setItem('user', JSON.stringify(user));

  getUser = () => JSON.parse(localStorage.getItem('user'));

  removeUser = () => localStorage.removeItem('user');
}
