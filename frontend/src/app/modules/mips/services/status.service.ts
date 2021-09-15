import { Injectable } from '@angular/core';
import { Status, StatusType } from '../types/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor() {}

  getStatusValue(data: string): string {
    if (data !== undefined) {
      if (data.toLocaleLowerCase().includes('accepted')) {
        return Status.ACCEPTED;
      }
      if (data.toLocaleLowerCase().includes('rfc')) {
        return Status.RFC;
      }
      if (data.toLocaleLowerCase().includes('rejected')) {
        return Status.REJECTED;
      }
      if (data.toLocaleLowerCase().includes('archived')) {
        return Status.ARCHIVED;
      }
      if (data.toLocaleLowerCase().includes('obsolete')) {
        return Status.OBSOLETE;
      }
      if (data.toLocaleLowerCase().includes('submission')) {
        return Status.FORMAL_SUBMISSION;
      }
      if (!data) {
        return 'EMPTY';
      }
    }

    return data;
  }

  getStatusType(data: string): string {
    if (data !== undefined) {
      if (data.toLocaleLowerCase().includes('accepted')) {
        return StatusType.ACCEPTED;
      }
      if (data.toLocaleLowerCase().includes('rfc')) {
        return StatusType.RFC;
      }
      if (data.toLocaleLowerCase().includes('rejected')) {
        return StatusType.REJECTED;
      }
      if (data.toLocaleLowerCase().includes('archived')) {
        return StatusType.ARCHIVED;
      }
      if (data.toLocaleLowerCase().includes('obsolete')) {
        return StatusType.OBSOLETE;
      }
      if (data.toLocaleLowerCase().includes('submission')) {
        return StatusType.FORMAL_SUBMISSION;
      }
      if (!data) {
        return StatusType.EMPTY;
      }
    }

    return StatusType.DEFAULT;
  }
}
