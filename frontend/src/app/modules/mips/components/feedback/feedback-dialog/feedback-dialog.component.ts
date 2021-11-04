import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent implements OnInit {
  @ViewChild('input') input: ElementRef;
  @ViewChild('textarea') textarea: ElementRef;
  feedbackForm = this.fb.group({
    subject: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    public darkModeService:DarkModeService,
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  sendFeedback() {
    this.dialogRef.close(this.feedbackForm.value);
  }
}
