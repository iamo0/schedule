import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import ScheduleService, { SpecialistNumberOfDays, SpecialistRoleNamePipe } from '../../data/services/schedule-service';
import daysInMonth from '../../data/helpers/days-in-month';
import isWeekend from '../../data/helpers/is-weekend';
import { DatePipe } from '@angular/common';
import Specialist from '../../data/types/specialist.interface';
import isToday from '../../data/helpers/is-today';

@Component({
  selector: 'app-home',
  imports: [SpecialistRoleNamePipe, SpecialistNumberOfDays, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  @ViewChild("todayCol") todayCol!: ElementRef;

  schedule = inject(ScheduleService);

  year = signal(new Date().getFullYear());

  month = signal(new Date().getMonth() + 1);

  selectedDate = computed(() => new Date(this.year(), this.month() - 1, 1));

  monthDates = computed(() => new Array(daysInMonth(this.month(), this.year()))
    .fill(undefined)
    .map((_val, i) => ({
      date: i + 1,
      isWeekend: isWeekend(new Date(this.year(), this.month() - 1, i + 1)),
      isToday: isToday(new Date(this.year(), this.month() - 1, i + 1)),
    })));

  onDateChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const userID = checkbox.name;
    const date = checkbox.value;

    this.schedule.specialists.update((specialists: Specialist[]) => {
      const copy = JSON.parse(JSON.stringify(specialists)) as Specialist[];
      const updatedIndex = copy.findIndex((s) => s.id === userID);
      copy[updatedIndex].dates[this.year()][this.month()][parseInt(date) - 1] = checkbox.checked;
      return copy;
    });
  }

  ngAfterViewInit() {
    this.todayCol.nativeElement.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  }
}
