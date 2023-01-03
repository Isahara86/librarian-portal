import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  get<T>(key: string): T | undefined {
    let data: unknown | undefined;
    const storedData = localStorage.getItem(key);
    try {
      if (storedData) {
        const parsedDate: { data: unknown; ttl: number } = JSON.parse(storedData);
        if (parsedDate.ttl > Date.now()) {
          data = parsedDate.data;
        }
      }
    } catch (err) {
      console.log(err);
    }

    return data as T;
  }

  set(key: string, data: unknown, ttl?: number): void {
    localStorage.setItem(key, JSON.stringify({ data, ttl }));
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}
