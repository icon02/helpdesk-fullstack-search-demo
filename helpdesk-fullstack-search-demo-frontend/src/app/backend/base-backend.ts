import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export abstract class BaseBackend {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl: string = 'http://localhost:8080/api';
}
