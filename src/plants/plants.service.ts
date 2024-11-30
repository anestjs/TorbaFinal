/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';   
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class PlantsService {
    constructor(private httpServ: HttpService) {}

    PlantsDetails(page: number): Observable<any> {
        const url = `https://perenual.com/api/species-list?key=sk-EKS1673f4540e7e9e7725&page=${page}`;
        
        return this.httpServ.get(url).pipe(
            catchError((error) => {
                console.error('API request failed:', error);
                return throwError(() => new Error('API request failed'));
            })
        );
    }
}