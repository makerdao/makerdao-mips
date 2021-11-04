import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackService } from 'src/app/modules/mips/services/feedback.service';
import { MipsService } from 'src/app/modules/mips/services/mips.service';
import IFeedback from 'src/app/modules/mips/types/feedback';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { MdFeedbackDialogComponent } from './md-feedback-dialog/md-feedback-dialog.component';

@Component({
  selector: 'app-md-feedback',
  templateUrl: './md-feedback.component.html',
  styleUrls: ['./md-feedback.component.scss'],
})
export class MdFeedbackComponent implements OnInit {
  showContainer = false;
  sent = false;
  feedbackData: IFeedback = {
    subject: '',
    description: '',
  };

  constructor(
    private mipsService: MipsService,
    public dialog: MatDialog,
    public darkModeService:DarkModeService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.feedbackService.showFeedbackDialog$.subscribe((data) => {
      if (data) {
        this.openDialog();
      }
    });
  }

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
    const dialogRef = this.dialog.open(MdFeedbackDialogComponent, {
      backdropClass: 'feedbackBackDropClass',
      position: {
        top: '30px',
        right: window.innerWidth <= 500 ? '' : '40px',
      },
      panelClass: this.darkModeService.getDarkMode() ? 'darkModeFeddbackPanelClass':'feedbackPanelClass',
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
