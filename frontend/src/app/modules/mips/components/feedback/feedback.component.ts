import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MipsService } from '../../services/mips.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import IFeedback from '../../types/feedback';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  showContainer = false;
  sent = false;
  feedbackData: IFeedback = {
    subject: '',
    description: '',
  };

  constructor(private mipsService: MipsService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  sendFeedback(): void {
    this.mipsService
      .sendFeedBack(this.feedbackData.subject, this.feedbackData.description)
      .subscribe(() => {
        this.sent = true;

        setTimeout(() => {
          this.sent = false;
        }, 3000);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      backdropClass: 'feedbackBackDropClass',
      position: {
        bottom: '40px',
        right: window.innerWidth <= 500 ? '' : '40px',
      },
      panelClass: 'feedbackPanelClass',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result: IFeedback) => {
      if (result) {
        this.feedbackData = result;
        this.sendFeedback();
      }
    });
  }
}
