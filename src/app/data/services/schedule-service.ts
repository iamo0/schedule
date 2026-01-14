import { Injectable, Pipe, PipeTransform, signal } from '@angular/core';
import Specialist, { Role } from '../types/specialist.interface';
import Data from './loader';
import { map, Observable } from 'rxjs';

@Pipe({ name: "isNotEmpty" })
export class IsNotEmptyPipe implements PipeTransform {
  transform(value: readonly Specialist[], year: string, month: string): boolean {
    return value.some((specialist) => (
      specialist.dates[year] !== undefined &&
      specialist.dates[year]![month] !== undefined
    ));
  };
}

@Pipe({ name: "rolename" })
export class SpecialistRoleNamePipe implements PipeTransform {
  #roleNames = new Map<Role, string>([
    [Role.MANAGER, "Администратор"],
    [Role.JUNIOR_MANAGER, "Пом. администратора"],
    [Role.MARSHALL, "Маршал"],
    [Role.SENIOR_MARSHALL, "Старший смены"],
    [Role.MECHANIC, "Механик"],
    [Role.JANITOR, "Уборщица"],
  ]);

  transform(role: Role) {
    return this.#roleNames.get(role);
  }
}

@Pipe({ name: "numberofdays" })
export class SpecialistNumberOfDays implements PipeTransform {
  transform(value: boolean[]):string {
    return value.filter((v) => v).length.toString();
  }
}

@Injectable({ providedIn: 'root' })
export default class ScheduleService {
  specialists$!:Observable<readonly Specialist[]>;

  load() {
    this.specialists$ = new Observable((subscriber) => {
      subscriber.next(Data);
      subscriber.complete();
    });
    return this.specialists$;
  }

  getMinMonth() {
    return this.specialists$.pipe(map((specialists) => {
      return Math.min(...specialists.map((specialist) => {
        return Math.min(...Object.keys(specialist.dates).map((year) => {
          return Math.min(...Object.keys(specialist.dates[year]!).map((month) => {
            return parseInt(month);
          }));
        }).filter((month) => month !== undefined));
      }).filter((month) => month !== undefined));
    }));
  }
}
